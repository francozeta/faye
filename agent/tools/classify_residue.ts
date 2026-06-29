import { defineTool } from "eve/tools"
import { z } from "zod"

import { demoResidueIds } from "../../lib/demo-residues"
import { buildFallbackClassification } from "../../lib/eve/fallback"

export default defineTool({
  description:
    "Classify a household residue for FAYE with a deterministic demo-safe response.",
  inputSchema: z.object({
    residueId: z.enum(demoResidueIds).optional(),
    imageName: z.string().trim().min(1).max(160).optional(),
    imageHint: z.string().trim().min(1).max(500).optional(),
    locale: z.string().trim().min(2).max(16).default("es-PE"),
  }),
  async execute(input) {
    return buildFallbackClassification(
      input,
      "Tool local de Eve usado como base estable de la demo."
    )
  },
})
