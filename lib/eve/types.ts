import type { DemoResidue } from "@/lib/demo-residues"
import type {
  WasteDestination,
  WasteResidueTypeId,
  WasteRuleScope,
} from "@/lib/waste-catalog"

export type EveClassificationSource = "ai" | "fallback"
export type EveInputMode = "image" | "demo" | "empty"
export type ResidueDecision = Omit<
  DemoResidue,
  "destination" | "id" | "normalized" | "residueTypeId" | "ruleScope"
> & {
  destination: WasteDestination
  id: string
  normalized: boolean
  residueTypeId: WasteResidueTypeId
  ruleScope: WasteRuleScope
}

export type EveClassificationInput = {
  residueId?: DemoResidue["id"]
  imageName?: string
  imageDataUrl?: string
  imageMediaType?: string
  imageHint?: string
  inputMode?: EveInputMode
  locale?: string
  forceFallback?: boolean
}

export type EveClassification = ResidueDecision & {
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
  model?: string
  title: string
  message: string
  actionLabel: string
  fallbackReason?: string
}

export type EveAnalysisResult = EveClassification | EveEmptyInputResponse
