import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const habitEventSchema = z.object({
  deviceId: z.string().trim().min(8).max(96),
  residue: z.object({
    id: z.string().trim().min(1).max(64),
    name: z.string().trim().min(1).max(120),
    material: z.string().trim().min(1).max(80),
    category: z.string().trim().min(1).max(80),
    bin: z.string().trim().min(1).max(96),
    points: z.number().int().min(0).max(30),
    confidence: z.number().int().min(0).max(100),
    preparation: z.string().trim().min(1).max(220).optional(),
    impact: z.string().trim().min(1).max(180).optional(),
    source: z.string().trim().min(1).max(32).optional(),
  }),
})

type HabitEventInput = z.infer<typeof habitEventSchema>

function createHabitClient(authorization?: string | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: authorization ? { Authorization: authorization } : {},
    },
  })
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  const parsed = habitEventSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        persisted: false,
        error: "Invalid habit event request.",
      },
      { status: 400 }
    )
  }

  const supabase = createHabitClient(request.headers.get("authorization"))

  if (!supabase) {
    return NextResponse.json(buildLocalResponse(parsed.data, "missing-env"))
  }

  const event = toHabitEventRow(parsed.data)
  const { error } = await supabase.from("habit_events").insert(event)

  if (error) {
    console.warn("[habit] Supabase insert failed", error.code)

    return NextResponse.json(buildLocalResponse(parsed.data, "insert-failed"))
  }

  return NextResponse.json({
    ok: true,
    persisted: true,
    storage: "supabase",
    event: {
      points: parsed.data.residue.points,
      progressDelta: 16,
      streakDelta: 1,
    },
  })
}

function toHabitEventRow(input: HabitEventInput) {
  return {
    device_id: input.deviceId,
    residue_id: input.residue.id,
    residue_name: input.residue.name,
    material: input.residue.material,
    category: input.residue.category,
    bin: input.residue.bin,
    points: input.residue.points,
    confidence: input.residue.confidence,
    source: input.residue.source ?? "unknown",
    preparation: input.residue.preparation ?? null,
    impact: input.residue.impact ?? null,
    metadata: {
      demo: true,
      locale: "es-PE",
    },
  }
}

function buildLocalResponse(input: HabitEventInput, reason: string) {
  return {
    ok: true,
    persisted: false,
    storage: "local",
    reason,
    event: {
      points: input.residue.points,
      progressDelta: 16,
      streakDelta: 1,
    },
  }
}
