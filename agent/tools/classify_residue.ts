import { defineTool } from "eve/tools"
import { z } from "zod"

import { demoResidueIds } from "../../lib/demo-residues"
import {
  buildEmptyInputResponse,
  buildFallbackClassification,
} from "../../lib/eve/fallback"

export default defineTool({
  description:
    "Classify a household residue for FAYE with a deterministic demo-safe response.",
  inputSchema: z.object({
    residueId: z.enum(demoResidueIds).optional(),
    imageName: z.string().trim().min(1).max(160).optional(),
    imageDataUrl: z.string().trim().startsWith("data:image/").optional(),
    imageMediaType: z
      .string()
      .trim()
      .regex(/^image\/[a-z0-9.+-]+$/i)
      .optional(),
    imageHint: z.string().trim().min(1).max(500).optional(),
    inputMode: z.enum(["image", "demo", "empty"]).optional(),
    locale: z.string().trim().min(2).max(16).default("es-PE"),
  }),
  async execute(input) {
    if (
      input.inputMode === "empty" ||
      (!input.imageDataUrl && !input.residueId)
    ) {
      return buildEmptyInputResponse({
        fallbackReason: "Tool local de Eve detecto entrada vacia.",
      })
    }

    if (input.inputMode === "image") {
      return buildEmptyInputResponse({
        fallbackReason:
          "Tool local de Eve no tiene vision directa; se evita inventar una clasificacion.",
        message:
          "La capa local no puede confirmar esta foto. Usa el analisis con IA o un residuo demo.",
        title: "Vision no disponible en modo local",
      })
    }

    return buildFallbackClassification(
      input,
      "Tool local de Eve usado como base estable de la demo."
    )
  },
})
