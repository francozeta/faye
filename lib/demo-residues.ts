import {
  getWasteResidueTypeById,
  toWasteDecision,
  type WasteDecision,
} from "@/lib/waste-catalog"

export const demoResidueIds = [
  "pet-bottle",
  "paper-receipt",
  "organic-scraps",
] as const

export type DemoResidueId = (typeof demoResidueIds)[number]

export type DemoResidue = WasteDecision & {
  id: DemoResidueId
  normalized: true
  residueTypeId: DemoResidueId
}

export const demoResidues: DemoResidue[] = demoResidueIds.map((id) => {
  const residue = getWasteResidueTypeById(id)

  if (!residue) {
    throw new Error(`Missing demo residue type: ${id}`)
  }

  return toWasteDecision(residue) as DemoResidue
})
