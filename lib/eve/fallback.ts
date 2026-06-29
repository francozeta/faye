import {
  demoResidues,
  type DemoResidue,
  type DemoResidueId,
} from "@/lib/demo-residues"

import type {
  EveClassification,
  EveClassificationInput,
  EveEmptyInputResponse,
} from "./types"

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
    status: "classified",
    analyzedAt: new Date().toISOString(),
    source: "fallback",
    fallbackReason,
  }
}

export function buildEmptyInputResponse(
  fallbackReason = "Eve no recibio una imagen ni un residuo demo."
): EveEmptyInputResponse {
  return {
    status: "needs_input",
    analyzedAt: new Date().toISOString(),
    source: "fallback",
    title: "No veo un residuo todavia",
    message:
      "Sube una foto o usa un residuo demo para que FAYE pueda clasificarlo con confianza.",
    actionLabel: "Agrega una imagen",
    fallbackReason,
  }
}
