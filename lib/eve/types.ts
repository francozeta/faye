import type { DemoResidue } from "@/lib/demo-residues"

export type EveClassificationSource = "ai" | "fallback"
export type EveInputMode = "image" | "demo" | "empty"

export type EveClassificationInput = {
  residueId?: DemoResidue["id"]
  imageName?: string
  imageHint?: string
  inputMode?: EveInputMode
  locale?: string
  forceFallback?: boolean
}

export type EveClassification = DemoResidue & {
  status: "classified"
  analyzedAt: string
  source: EveClassificationSource
  model?: string
  fallbackReason?: string
}

export type EveEmptyInputResponse = {
  status: "needs_input"
  analyzedAt: string
  source: EveClassificationSource
  title: string
  message: string
  actionLabel: string
  fallbackReason?: string
}

export type EveAnalysisResult = EveClassification | EveEmptyInputResponse
