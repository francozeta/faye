import "server-only"

import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { z } from "zod"

import { demoResidueIds } from "@/lib/demo-residues"
import {
  buildEmptyInputResponse,
  buildFallbackClassification,
  getDemoResidueById,
} from "@/lib/eve/fallback"
import type {
  EveAnalysisResult,
  EveClassificationInput,
  EveInputMode,
} from "@/lib/eve/types"
import {
  buildWasteCatalogPromptSummary,
  getUncertainWasteDecision,
  normalizeWasteDecision,
  wasteDestinations,
  wasteResidueTypeIds,
  wasteRuleScopes,
} from "@/lib/waste-catalog"

export const DEFAULT_EVE_MODEL = "openai/gpt-5.4-mini"
const DEFAULT_EVE_GOOGLE_MODEL = "gemini-2.5-flash"
const DEFAULT_EVE_OPENAI_MODEL = "gpt-4.1-mini"
const EVE_MODEL_FALLBACKS = [
  "openai/gpt-4o-mini",
  "mistral/pixtral-12b",
  "google/gemini-2.5-flash-lite",
] as const
const EVE_PROVIDER_VALUES = ["auto", "gateway", "google", "openai"] as const

type EveProviderPreference = (typeof EVE_PROVIDER_VALUES)[number]
type EveModelCandidate = {
  id: string
  model: Parameters<typeof generateText>[0]["model"]
  provider: Exclude<EveProviderPreference, "auto">
  providerOptions?: Parameters<typeof generateText>[0]["providerOptions"]
}

export const eveClassificationInputSchema = z.object({
  residueId: z.enum(demoResidueIds).optional(),
  imageName: z.string().trim().min(1).max(160).optional(),
  imageDataUrl: z
    .string()
    .trim()
    .startsWith("data:image/")
    .max(6_500_000)
    .optional(),
  imageMediaType: z
    .string()
    .trim()
    .regex(/^image\/[a-z0-9.+-]+$/i)
    .optional(),
  imageHint: z.string().trim().min(1).max(500).optional(),
  inputMode: z.enum(["image", "demo", "empty"]).optional(),
  locale: z.string().trim().min(2).max(16).default("es-PE"),
  forceFallback: z.boolean().default(false),
})

const eveClassificationOutputSchema = z.object({
  status: z.literal("classified"),
  id: z.string().trim().min(1).max(48),
  residueTypeId: z.enum(wasteResidueTypeIds),
  normalized: z.boolean(),
  name: z.string().trim().min(1).max(80),
  shortName: z.string().trim().min(1).max(32),
  material: z.string().trim().min(1).max(48),
  category: z.string().trim().min(1).max(56),
  bin: z.string().trim().min(1).max(64),
  confidence: z.number().min(0).max(100),
  destination: z.enum(wasteDestinations),
  ruleScope: z.enum(wasteRuleScopes),
  preparation: z.string().trim().min(1).max(180),
  rationale: z.string().trim().min(1).max(240),
  habit: z.string().trim().min(1).max(140),
  impact: z.string().trim().min(1).max(140),
  reward: z.string().trim().min(1).max(40),
  points: z.number().int().min(0).max(30),
  visual: z.object({
    label: z.string().trim().min(1).max(12),
    detail: z.string().trim().min(1).max(24),
  }),
})

const eveNeedsInputOutputSchema = z.object({
  status: z.literal("needs_input"),
  title: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(180),
  actionLabel: z.string().trim().min(1).max(40),
})

const eveAnalysisOutputSchema = z.discriminatedUnion("status", [
  eveClassificationOutputSchema,
  eveNeedsInputOutputSchema,
])

const rawEveClassificationOutputSchema = z
  .object({
    status: z.literal("classified"),
    id: z.unknown().optional(),
    residueTypeId: z.unknown().optional(),
    name: z.unknown().optional(),
    shortName: z.unknown().optional(),
    material: z.unknown().optional(),
    category: z.unknown().optional(),
    bin: z.unknown().optional(),
    confidence: z.unknown().optional(),
    preparation: z.unknown().optional(),
    rationale: z.unknown().optional(),
    habit: z.unknown().optional(),
    impact: z.unknown().optional(),
    reward: z.unknown().optional(),
    points: z.unknown().optional(),
    visual: z
      .object({
        label: z.unknown().optional(),
        detail: z.unknown().optional(),
      })
      .optional(),
  })
  .passthrough()

const rawEveNeedsInputOutputSchema = z
  .object({
    status: z.literal("needs_input"),
    title: z.unknown().optional(),
    message: z.unknown().optional(),
    actionLabel: z.unknown().optional(),
  })
  .passthrough()

const rawEveAnalysisOutputSchema = z.discriminatedUnion("status", [
  rawEveClassificationOutputSchema,
  rawEveNeedsInputOutputSchema,
])

export type ParsedEveClassificationInput = z.infer<
  typeof eveClassificationInputSchema
>

export function getEveModel() {
  const model = process.env.FAYE_AI_MODEL?.trim()

  if (!model || model.startsWith("sk-") || !model.includes("/")) {
    return DEFAULT_EVE_MODEL
  }

  return model
}

export function getEveProviderPreference(): EveProviderPreference {
  const provider = process.env.FAYE_AI_PROVIDER?.trim().toLowerCase()

  if (
    provider &&
    EVE_PROVIDER_VALUES.includes(provider as EveProviderPreference)
  ) {
    return provider as EveProviderPreference
  }

  return "auto"
}

export function getEveGoogleModel() {
  return process.env.FAYE_GOOGLE_MODEL?.trim() || DEFAULT_EVE_GOOGLE_MODEL
}

export function getEveOpenAiModel() {
  return process.env.FAYE_OPENAI_MODEL?.trim() || DEFAULT_EVE_OPENAI_MODEL
}

export function getEveModelCandidates() {
  const preference = getEveProviderPreference()
  const candidates: EveModelCandidate[] = []

  if (
    (preference === "auto" || preference === "google") &&
    hasGoogleDirectKey()
  ) {
    const model = getEveGoogleModel()

    candidates.push({
      id: `google/${model}`,
      model: google(model),
      provider: "google",
      providerOptions: {
        google: {
          mediaResolution: "MEDIA_RESOLUTION_LOW",
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      },
    })
  }

  if (
    (preference === "auto" || preference === "openai") &&
    hasOpenAiDirectKey()
  ) {
    const model = getEveOpenAiModel()

    candidates.push({
      id: `openai/${model}`,
      model: openai(model),
      provider: "openai",
      providerOptions: {
        openai: {
          store: false,
        },
      },
    })
  }

  if (preference === "auto" || preference === "gateway") {
    for (const model of [getEveModel(), ...EVE_MODEL_FALLBACKS]) {
      if (candidates.some((candidate) => candidate.id === model)) {
        continue
      }

      candidates.push({
        id: model,
        model,
        provider: "gateway",
        providerOptions: {
          gateway: {
            tags: ["feature:eve-classifier"],
          },
        },
      })
    }
  }

  return candidates.filter(
    (candidate, index, models) =>
      models.findIndex((model) => model.id === candidate.id) === index
  )
}

export function isEveGatewayConfigured() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
}

export function hasGoogleDirectKey() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
}

export function hasOpenAiDirectKey() {
  return Boolean(process.env.OPENAI_API_KEY)
}

export function isEveAiConfigured() {
  return (
    hasGoogleDirectKey() || hasOpenAiDirectKey() || isEveGatewayConfigured()
  )
}

export async function classifyResidueWithEve(
  input: ParsedEveClassificationInput
): Promise<EveAnalysisResult> {
  const inputMode =
    input.inputMode ??
    (input.imageDataUrl ? "image" : input.residueId ? "demo" : "empty")

  if (inputMode === "empty") {
    return buildEmptyInputResponse()
  }

  if (inputMode === "image" && !input.imageDataUrl) {
    return buildEmptyInputResponse({
      fallbackReason: "Eve recibio modo imagen sin datos visuales.",
      message:
        "La imagen no llego completa. Vuelve a tomarla o subela otra vez para analizar el residuo.",
      title: "No pude leer la imagen",
    })
  }

  if (input.forceFallback) {
    return buildFallbackClassification(
      input,
      "Fallback solicitado para verificar la demo sin gastar IA."
    )
  }

  const candidates = getEveModelCandidates()

  if (!isEveAiConfigured() || candidates.length === 0) {
    if (inputMode === "image") {
      return buildEmptyInputResponse({
        fallbackReason:
          "No hay proveedor de IA configurado; Eve evito usar una clasificacion demo para una imagen real.",
        message:
          "No puedo confirmar esta imagen sin la capa visual activa. Prueba un escenario demo o configura un proveedor de IA.",
        title: "Vision no configurada",
      })
    }

    return buildFallbackClassification(
      input,
      "No se encontro GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY, AI_GATEWAY_API_KEY ni VERCEL_OIDC_TOKEN."
    )
  }

  const seed = getDemoResidueById(input.residueId)
  let lastError: unknown

  for (const candidate of candidates) {
    try {
      const { text } = await generateText({
        model: candidate.model,
        instructions:
          "Eres Eve, la capa inteligente invisible de FAYE. Clasificas residuos domesticos para convertir duda en accion. Responde siempre en espanol claro, breve y accionable. No eres un chatbot generico: tu trabajo es dar una decision, una preparacion concreta, impacto simple y una senal de habito. No inventes reglas municipales ni precision falsa; cuando haya incertidumbre, usa lenguaje probable. Devuelve exclusivamente un objeto JSON valido, sin markdown, sin explicacion fuera del JSON.",
        maxRetries: 0,
        messages: [
          {
            role: "user",
            content: buildUserContent(input, seed, inputMode),
          },
        ],
        providerOptions: withModeTag(candidate.providerOptions, inputMode),
      })
      const output = parseEveOutput(
        text,
        inputMode === "demo" ? seed : null
      )

      if (output.status === "needs_input") {
        return {
          ...output,
          analyzedAt: new Date().toISOString(),
          source: "ai",
          model: candidate.id,
        }
      }

      return {
        ...output,
        confidence: Math.round(output.confidence),
        points: Math.round(output.points),
        analyzedAt: new Date().toISOString(),
        source: "ai",
        model: candidate.id,
      }
    } catch (error) {
      lastError = error
      console.warn(
        "[eve] AI model attempt failed",
        candidate.id,
        getSafeErrorLabel(error)
      )
    }
  }

  console.warn("[eve] AI classification fell back", getSafeErrorLabel(lastError))

  if (inputMode === "image") {
    return buildEmptyInputResponse({
      fallbackReason:
        "Los proveedores de IA no pudieron completar vision; Eve evito inventar una clasificacion.",
      message:
        "No pude analizar esa imagen con suficiente confianza. Intenta otra foto con el residuo centrado y buena luz.",
      title: "No pude confirmar el residuo",
    })
  }

  return buildFallbackClassification(
    input,
    "La IA no respondio a tiempo; Eve mantuvo la demo con una clasificacion local."
  )
}

function parseEveOutput(
  rawText: string,
  seed: ReturnType<typeof getDemoResidueById> | null
) {
  const parsedJson = JSON.parse(extractJsonObject(rawText)) as unknown
  const rawOutput = rawEveAnalysisOutputSchema.parse(parsedJson)
  const fallback = seed ?? getUncertainWasteDecision()

  if (rawOutput.status === "needs_input") {
    return eveAnalysisOutputSchema.parse({
      status: "needs_input",
      title: cleanText(rawOutput.title, "No veo un residuo claro", 80),
      message: cleanText(
        rawOutput.message,
        "Sube otra foto donde el residuo este centrado y visible.",
        180
      ),
      actionLabel: cleanText(rawOutput.actionLabel, "Agrega una imagen", 40),
    })
  }

  const name = cleanText(rawOutput.name, fallback.name, 80)
  const shortName = cleanText(rawOutput.shortName, name, 32)
  const material = cleanText(rawOutput.material, fallback.material, 48)
  const category = cleanText(rawOutput.category, fallback.category, 56)
  const bin = cleanText(rawOutput.bin, fallback.bin, 64)
  const points = toBoundedInteger(rawOutput.points, fallback.points, 0, 30)
  const rawDecision = {
    id: cleanKebabId(rawOutput.id, shortName),
    residueTypeId: cleanOptionalText(rawOutput.residueTypeId, 80),
    name,
    shortName,
    material,
    category,
    bin,
    confidence: toBoundedInteger(
      rawOutput.confidence,
      fallback.confidence,
      0,
      100
    ),
    preparation: cleanText(rawOutput.preparation, fallback.preparation, 180),
    rationale: cleanText(rawOutput.rationale, fallback.rationale, 240),
    habit: cleanText(rawOutput.habit, fallback.habit, 140),
    impact: cleanText(rawOutput.impact, fallback.impact, 140),
    reward: cleanText(rawOutput.reward, `+${points} puntos de habito`, 40),
    points,
    visual: {
      label: cleanVisualLabel(
        rawOutput.visual?.label,
        `${material} ${name} ${category}`,
        fallback.visual.label
      ),
      detail: cleanText(rawOutput.visual?.detail, material, 24),
    },
  }
  const normalizedDecision = normalizeWasteDecision(rawDecision, seed)

  return eveAnalysisOutputSchema.parse({
    status: "classified",
    ...normalizedDecision,
  })
}

function extractJsonObject(rawText: string) {
  const trimmed = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")

  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Eve output did not include a JSON object.")
  }

  return trimmed.slice(start, end + 1)
}

function withModeTag(
  providerOptions: EveModelCandidate["providerOptions"],
  inputMode: EveInputMode
) {
  if (!providerOptions?.gateway) {
    return providerOptions
  }

  return {
    ...providerOptions,
    gateway: {
      ...providerOptions.gateway,
      tags: ["feature:eve-classifier", `mode:${inputMode}`],
    },
  }
}

function cleanText(value: unknown, fallback: string, maxLength: number) {
  const text = typeof value === "string" ? value.trim() : ""
  const safeText = text || fallback

  return safeText.length > maxLength
    ? safeText.slice(0, maxLength).trim()
    : safeText
}

function cleanOptionalText(value: unknown, maxLength: number) {
  const text = typeof value === "string" ? value.trim() : ""

  if (!text) {
    return undefined
  }

  return text.length > maxLength ? text.slice(0, maxLength).trim() : text
}

function cleanKebabId(value: unknown, fallback: string) {
  const text = cleanText(value, fallback, 48)
  const id = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return id || "residuo-domestico"
}

function cleanVisualLabel(value: unknown, context: string, fallback: string) {
  const text = typeof value === "string" ? value.trim() : ""

  if (text && text.length <= 12) {
    return text
  }

  const normalized = `${text} ${context}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  if (normalized.includes("pet")) return "PET"
  if (normalized.includes("plast")) return "PLA"
  if (normalized.includes("vidrio")) return "VID"
  if (normalized.includes("metal") || normalized.includes("lata")) return "MET"
  if (normalized.includes("carton")) return "CAR"
  if (normalized.includes("papel")) return "PAP"
  if (normalized.includes("organic")) return "ORG"

  return cleanText(fallback, "RES", 12)
}

function toBoundedInteger(
  value: unknown,
  fallback: number,
  min: number,
  max: number
) {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN

  if (!Number.isFinite(numericValue)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.round(numericValue)))
}

function buildUserContent(
  input: EveClassificationInput,
  seed: ReturnType<typeof getDemoResidueById>,
  inputMode: EveInputMode
) {
  const text = buildClassificationPrompt(input, seed, inputMode)

  if (inputMode !== "image" || !input.imageDataUrl) {
    return text
  }

  return [
    { type: "text" as const, text },
    {
      type: "file" as const,
      mediaType: input.imageMediaType ?? "image",
      data: input.imageDataUrl,
      providerOptions: {
        openai: { imageDetail: "low" },
      },
    },
  ]
}

function buildClassificationPrompt(
  input: EveClassificationInput,
  seed: ReturnType<typeof getDemoResidueById>,
  inputMode: EveInputMode
) {
  const imageContext = input.imageName
    ? `El usuario subio una imagen llamada "${input.imageName}". Analiza los pixeles de la imagen; el nombre del archivo no es evidencia suficiente.`
    : "El usuario esta usando un residuo demo."
  const hint = input.imageHint
    ? `Pista adicional del usuario: ${input.imageHint}`
    : "Sin pista adicional."
  const seedContext =
    inputMode === "demo"
      ? `Residuo base de la demo: ${JSON.stringify(seed)}`
      : "No hay residuo base confiable: decide solo por la imagen y devuelve needs_input si no ves un residuo domestico claro."
  const catalogContext = buildWasteCatalogPromptSummary()

  return [
    "Contexto: FAYE es una app peruana para formar habitos de clasificacion y reciclaje domestico.",
    "Problema que resuelve: incertidumbre al botar residuos, poca separacion en casa y falta de retroalimentacion inmediata.",
    "Si la imagen no muestra un residuo domestico visible, si es demasiado ambigua, o si solo muestra una persona, animal, paisaje o comida servida no destinada a desecharse, responde needs_input. No fuerces una clasificacion.",
    "Si ves un envase, empaque, papel, vidrio, metal, plastico u otro material clasificable, responde classified aunque no este aplastado o vacio; usa preparacion condicional cuando haga falta.",
    "Usa el catalogo canonico cuando corresponda. Si el residuo no encaja en ningun tipo, responde needs_input o usa baja confianza; no inventes una categoria nueva.",
    "Catalogo canonico:",
    catalogContext,
    "Si hay un residuo claro, responde classified con un id en kebab-case, residueTypeId del catalogo, nombre, categoria, destino, preparacion e impacto. Evita inventar reglas municipales especificas.",
    "Formato obligatorio para classified: {\"status\":\"classified\",\"id\":\"kebab-case\",\"residueTypeId\":\"pet-bottle\",\"name\":\"...\",\"shortName\":\"...\",\"material\":\"...\",\"category\":\"...\",\"bin\":\"...\",\"confidence\":0-100,\"preparation\":\"...\",\"rationale\":\"...\",\"habit\":\"...\",\"impact\":\"...\",\"reward\":\"+N puntos de habito\",\"points\":0-30,\"visual\":{\"label\":\"...\",\"detail\":\"...\"}}.",
    "Formato obligatorio para needs_input: {\"status\":\"needs_input\",\"title\":\"...\",\"message\":\"...\",\"actionLabel\":\"Agrega una imagen\"}.",
    imageContext,
    hint,
    seedContext,
    "Ajusta el texto para sonar como producto real. Mantente dentro del esquema.",
  ].join("\n")
}

function getSafeErrorLabel(error: unknown) {
  if (error instanceof Error) {
    return error.name
  }

  return "UnknownError"
}
