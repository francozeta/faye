import { NextResponse } from "next/server"

import {
  classifyResidueWithEve,
  eveClassificationInputSchema,
  getEveModel,
  isEveGatewayConfigured,
} from "@/lib/eve/classifier"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    ok: true,
    agent: "eve",
    model: getEveModel(),
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
