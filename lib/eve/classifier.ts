import "server-only"

import { generateText, Output } from "ai"
import { z } from "zod"

import { demoResidueIds } from "@/lib/demo-residues"
import {
  buildFallbackClassification,
  getDemoResidueById,
} from "@/lib/eve/fallback"
import type { EveClassification, EveClassificationInput } from "@/lib/eve/types"

export const DEFAULT_EVE_MODEL = "openai/gpt-5.4-mini"

export const eveClassificationInputSchema = z.object({
  residueId: z.enum(demoResidueIds).optional(),
  imageName: z.string().trim().min(1).max(160).optional(),
  imageHint: z.string().trim().min(1).max(500).optional(),
  locale: z.string().trim().min(2).max(16).default("es-PE"),
  forceFallback: z.boolean().default(false),
})

const eveClassificationOutputSchema = z.object({
  id: z.enum(demoResidueIds),
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

export function isEveGatewayConfigured() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
}

export async function classifyResidueWithEve(
  input: ParsedEveClassificationInput
): Promise<EveClassification> {
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
  const model = getEveModel()

  try {
    const { output } = await generateText({
      model,
      instructions:
        "Eres Eve, la capa inteligente invisible de FAYE. Clasificas residuos domesticos para convertir duda en accion. Responde siempre en espanol claro, breve y accionable. No eres un chatbot generico: tu trabajo es dar una decision, una preparacion concreta, impacto simple y una senal de habito. No inventes reglas municipales ni precision falsa; cuando haya incertidumbre, usa lenguaje probable.",
      output: Output.object({
        name: "FayeResidueClassification",
        description:
          "Clasificacion compacta de residuo domestico para la experiencia FAYE.",
        schema: eveClassificationOutputSchema,
      }),
      prompt: buildClassificationPrompt(input, seed),
    })

    return {
      ...output,
      confidence: Math.round(output.confidence),
      points: Math.round(output.points),
      analyzedAt: new Date().toISOString(),
      source: "ai",
      model,
    }
  } catch (error) {
    console.warn("[eve] AI classification fell back", getSafeErrorLabel(error))

    return buildFallbackClassification(
      input,
      "La IA no respondio a tiempo; Eve mantuvo la demo con una clasificacion local."
    )
  }
}

function buildClassificationPrompt(
  input: EveClassificationInput,
  seed: ReturnType<typeof getDemoResidueById>
) {
  const imageContext = input.imageName
    ? `El usuario subio una imagen llamada "${input.imageName}".`
    : "El usuario esta usando un residuo demo."
  const hint = input.imageHint
    ? `Pista adicional del usuario: ${input.imageHint}`
    : "Sin pista adicional."

  return [
    "Contexto: FAYE es una app peruana para formar habitos de clasificacion y reciclaje domestico.",
    "Problema que resuelve: incertidumbre al botar residuos, poca separacion en casa y falta de retroalimentacion inmediata.",
    imageContext,
    hint,
    `Residuo base de la demo: ${JSON.stringify(seed)}`,
    "Ajusta el texto para sonar como producto real. Mantente dentro del esquema. Usa el mismo id del residuo base salvo que la pista contradiga claramente el residuo.",
  ].join("\n")
}

function getSafeErrorLabel(error: unknown) {
  if (error instanceof Error) {
    return error.name
  }

  return "UnknownError"
}
