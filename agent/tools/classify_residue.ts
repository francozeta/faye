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
    imageHint: z.string().trim().min(1).max(500).optional(),
    inputMode: z.enum(["image", "demo", "empty"]).optional(),
    locale: z.string().trim().min(2).max(16).default("es-PE"),
  }),
  async execute(input) {
    if (input.inputMode === "empty" || (!input.imageName && !input.residueId)) {
      return buildEmptyInputResponse("Tool local de Eve detecto entrada vacia.")
    }

    return buildFallbackClassification(
      input,
      "Tool local de Eve usado como base estable de la demo."
    )
  },
})
