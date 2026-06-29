import {
  demoResidues,
  type DemoResidue,
  type DemoResidueId,
} from "@/lib/demo-residues"

import type { EveClassification, EveClassificationInput } from "./types"

export function getDemoResidueById(id?: string | null): DemoResidue {
  return (
    demoResidues.find((residue) => residue.id === id) ??
    demoResidues.find((residue) => residue.id === "pet-bottle") ??
    demoResidues[0]
  )
}

export function isDemoResidueId(value: string): value is DemoResidueId {
  return demoResidues.some((residue) => residue.id === value)
}

export function buildFallbackClassification(
  input: EveClassificationInput,
  fallbackReason = "Eve uso una respuesta local estable para mantener la demo."
): EveClassification {
  const residue = getDemoResidueById(input.residueId)

  return {
    ...residue,
    analyzedAt: new Date().toISOString(),
    source: "fallback",
    fallbackReason,
  }
}
