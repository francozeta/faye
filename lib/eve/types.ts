import type { DemoResidue } from "@/lib/demo-residues"

export type EveClassificationSource = "ai" | "fallback"

export type EveClassificationInput = {
  residueId?: DemoResidue["id"]
  imageName?: string
  imageHint?: string
  locale?: string
  forceFallback?: boolean
}

export type EveClassification = DemoResidue & {
  analyzedAt: string
  source: EveClassificationSource
  model?: string
  fallbackReason?: string
}
