import "server-only"

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

export const DEFAULT_EVE_MODEL = "openai/gpt-5.4-mini"
const EVE_MODEL_FALLBACKS = [
  "openai/gpt-4o-mini",
  "mistral/pixtral-12b",
  "google/gemini-2.5-flash-lite",
] as const

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
  name: z.string().trim().min(1).max(80),
  shortName: z.string().trim().min(1).max(32),
  material: z.string().trim().min(1).max(48),
  category: z.string().trim().min(1).max(56),
  bin: z.string().trim().min(1).max(64),
  confidence: z.number().min(0).max(100),
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

export function getEveModelCandidates() {
  return [getEveModel(), ...EVE_MODEL_FALLBACKS].filter(
    (model, index, models) => models.indexOf(model) === index
  )
}

export function isEveGatewayConfigured() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
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

  if (!isEveGatewayConfigured()) {
    return buildFallbackClassification(
      input,
      "No se encontro AI_GATEWAY_API_KEY ni VERCEL_OIDC_TOKEN."
    )
  }

  const seed = getDemoResidueById(input.residueId)
  let lastError: unknown

  for (const model of getEveModelCandidates()) {
    try {
      const { text } = await generateText({
        model,
        instructions:
          "Eres Eve, la capa inteligente invisible de FAYE. Clasificas residuos domesticos para convertir duda en accion. Responde siempre en espanol claro, breve y accionable. No eres un chatbot generico: tu trabajo es dar una decision, una preparacion concreta, impacto simple y una senal de habito. No inventes reglas municipales ni precision falsa; cuando haya incertidumbre, usa lenguaje probable. Devuelve exclusivamente un objeto JSON valido, sin markdown, sin explicacion fuera del JSON.",
        maxRetries: 0,
        messages: [
          {
            role: "user",
            content: buildUserContent(input, seed, inputMode),
          },
        ],
        providerOptions: {
          gateway: {
            tags: ["feature:eve-classifier", `mode:${inputMode}`],
          },
        },
      })
      const output = parseEveOutput(text)

      if (output.status === "needs_input") {
        return {
          ...output,
          analyzedAt: new Date().toISOString(),
          source: "ai",
          model,
        }
      }

      return {
        ...output,
        confidence: Math.round(output.confidence),
        points: Math.round(output.points),
        analyzedAt: new Date().toISOString(),
        source: "ai",
        model,
      }
    } catch (error) {
      lastError = error
      console.warn(
        "[eve] AI model attempt failed",
        model,
        getSafeErrorLabel(error)
      )
    }
  }

  console.warn("[eve] AI classification fell back", getSafeErrorLabel(lastError))

  if (inputMode === "image") {
    return buildEmptyInputResponse({
      fallbackReason:
        "Gateway no pudo completar vision; Eve evito inventar una clasificacion.",
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

function parseEveOutput(rawText: string) {
  const parsedJson = JSON.parse(extractJsonObject(rawText)) as unknown

  return eveAnalysisOutputSchema.parse(parsedJson)
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

  return [
    "Contexto: FAYE es una app peruana para formar habitos de clasificacion y reciclaje domestico.",
    "Problema que resuelve: incertidumbre al botar residuos, poca separacion en casa y falta de retroalimentacion inmediata.",
    "Si la imagen no muestra un residuo domestico visible, si es demasiado ambigua, o si solo muestra una persona, animal, paisaje o comida servida no destinada a desecharse, responde needs_input. No fuerces una clasificacion.",
    "Si ves un envase, empaque, papel, vidrio, metal, plastico u otro material clasificable, responde classified aunque no este aplastado o vacio; usa preparacion condicional cuando haga falta.",
    "Si hay un residuo claro, responde classified con un id en kebab-case, nombre, categoria, destino, preparacion e impacto. Evita inventar reglas municipales especificas.",
    "Formato obligatorio para classified: {\"status\":\"classified\",\"id\":\"kebab-case\",\"name\":\"...\",\"shortName\":\"...\",\"material\":\"...\",\"category\":\"...\",\"bin\":\"...\",\"confidence\":0-100,\"preparation\":\"...\",\"rationale\":\"...\",\"habit\":\"...\",\"impact\":\"...\",\"reward\":\"+N puntos de habito\",\"points\":0-30,\"visual\":{\"label\":\"...\",\"detail\":\"...\"}}.",
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
