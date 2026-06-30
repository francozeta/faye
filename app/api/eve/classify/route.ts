import { NextResponse } from "next/server"

import {
  classifyResidueWithEve,
  eveClassificationInputSchema,
  getEveGoogleModel,
  getEveModel,
  getEveModelCandidates,
  getEveOpenAiModel,
  getEveProviderPreference,
  hasGoogleDirectKey,
  hasOpenAiDirectKey,
  isEveAiConfigured,
  isEveGatewayConfigured,
} from "@/lib/eve/classifier"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    ok: true,
    agent: "eve",
    model: getEveModel(),
    providerPreference: getEveProviderPreference(),
    directModels: {
      google: getEveGoogleModel(),
      openai: getEveOpenAiModel(),
    },
    configured: {
      ai: isEveAiConfigured(),
      gateway: isEveGatewayConfigured(),
      google: hasGoogleDirectKey(),
      openai: hasOpenAiDirectKey(),
    },
    candidates: getEveModelCandidates().map((candidate) => ({
      id: candidate.id,
      provider: candidate.provider,
    })),
    aiGatewayConfigured: isEveGatewayConfigured(),
  })
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  const parsed = eveClassificationInputSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid Eve classification request." },
      { status: 400 }
    )
  }

  const classification = await classifyResidueWithEve(parsed.data)

  return NextResponse.json(classification)
}
