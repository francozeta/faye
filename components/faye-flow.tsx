"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AiScanIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Leaf01Icon,
  Recycle01Icon,
  SparklesIcon,
  WasteIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { FayeDropzone } from "@/components/faye-dropzone"
import { FayeLogo } from "@/components/faye-logo"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/components/ui/marker"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import type { DemoResidue } from "@/lib/demo-residues"
import type {
  EveAnalysisResult,
  EveEmptyInputResponse,
  EveInputMode,
  ResidueDecision,
} from "@/lib/eve/types"
import { createBrowserSupabaseClient } from "@/lib/supabase/browser"
import { cn } from "@/lib/utils"

type FayeView = "scan" | "result" | "habit" | "demo"
type Phase = "ready" | "analyzing" | "recording" | "logged"
type AuthStatus =
  | "authenticated"
  | "checking"
  | "error"
  | "guest"
  | "sending"
  | "sent"
  | "unavailable"
type UploadPreview = {
  dataUrl: string
  mediaType: string
  name: string
  sizeLabel: string
  url: string
}
type DisplayResidue = DemoResidue | ResidueDecision
type StoredHabit = {
  count: number
  lastSyncedAt?: string
  points: number
  progress: number
  streak: number
  synced?: boolean
}
type HabitEventPayload = {
  deviceId: string
  residue: {
    bin: string
    category: string
    confidence: number
    id: string
    impact?: string
    material: string
    name: string
    points: number
    preparation?: string
    source?: string
  }
}
type HabitAuthState = {
  email: string
  message: string | null
  status: AuthStatus
}

const emptyHabit: StoredHabit = {
  count: 0,
  points: 0,
  progress: 0,
  streak: 0,
  synced: false,
}

const lastHabitEventStorageKey = "faye:last-habit-event"

const scenarioIcons = {
  "pet-bottle": Recycle01Icon,
  "paper-receipt": WasteIcon,
  "organic-scraps": Leaf01Icon,
} satisfies Record<DemoResidue["id"], typeof Recycle01Icon>

function getResidueIcon(id: string) {
  return scenarioIcons[id as DemoResidue["id"]] ?? WasteIcon
}

async function createImagePayload(file: File) {
  const url = URL.createObjectURL(file)

  try {
    const image = await loadImage(url)
    const maxDimension = 1280
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.naturalWidth, image.naturalHeight)
    )
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))

    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("Canvas context unavailable")
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    })

    if (!blob) {
      throw new Error("Canvas export unavailable")
    }

    return {
      dataUrl: await readBlobAsDataUrl(blob),
      mediaType: blob.type,
      url,
    }
  } catch {
    return {
      dataUrl: await readBlobAsDataUrl(file),
      mediaType: file.type || "image",
      url,
    }
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Image load failed"))
    image.src = src
  })
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function getOrCreateDeviceId() {
  const storageKey = "faye:device-id"
  const storedId = window.localStorage.getItem(storageKey)

  if (storedId) {
    return storedId
  }

  const nextId =
    window.crypto.randomUUID?.() ??
    `device-${Date.now()}-${Math.random().toString(36).slice(2)}`

  window.localStorage.setItem(storageKey, nextId)

  return nextId
}

async function postHabitEvent(
  payload: HabitEventPayload,
  accessToken?: string | null
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch("/api/habit/events", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })
  const result = (await response.json()) as { persisted?: boolean }

  return response.ok && Boolean(result.persisted)
}

function residueKind(residue: DisplayResidue) {
  return residue.category || residue.material || residue.shortName
}

function sourceLabel(source: string | null, hasUpload = false) {
  if (source === "ai") {
    return "IA visual"
  }

  if (source === "fallback") {
    return "Modo seguro"
  }

  if (source === "upload" || hasUpload) {
    return "Imagen"
  }

  return "Sesion"
}

export function FayeFlow({
  view,
  source = null,
}: {
  view: FayeView
  initialResidueId?: string | null
  source?: string | null
}) {
  const router = useRouter()
  const [phase, setPhase] = React.useState<Phase>("ready")
  const [habit, setHabit] = React.useState<StoredHabit>(() => {
    if (typeof window === "undefined") {
      return emptyHabit
    }

    const storedHabit = window.sessionStorage.getItem("faye:habit")

    if (!storedHabit) {
      return emptyHabit
    }

    try {
      return JSON.parse(storedHabit) as StoredHabit
    } catch {
      window.sessionStorage.removeItem("faye:habit")
      return emptyHabit
    }
  })
  const [uploadPreview, setUploadPreview] =
    React.useState<UploadPreview | null>(null)
  const [analysisResult, setAnalysisResult] =
    React.useState<EveAnalysisResult | null>(null)
  const supabase = React.useMemo(() => createBrowserSupabaseClient(), [])
  const [authAccessToken, setAuthAccessToken] = React.useState<string | null>(
    null
  )
  const [authState, setAuthState] = React.useState<HabitAuthState>(() =>
    supabase
      ? {
          email: "",
          message: null,
          status: "checking",
        }
      : {
          email: "",
          message: "Supabase Auth no esta configurado.",
          status: "unavailable",
        }
  )

  const activeResidue =
    analysisResult?.status === "classified" ? analysisResult : null
  const activeSource = analysisResult?.source ?? source
  const inputNotice =
    analysisResult?.status === "needs_input" ? analysisResult : null
  const isLogged = phase === "logged" || habit.count > 0
  const flowStarted = Boolean(uploadPreview || activeResidue)
  const canGoBack =
    Boolean(activeResidue) && (view === "result" || view === "habit")
  const canGoForward =
    Boolean(activeResidue) &&
    (view === "scan" || (view === "result" && isLogged))

  React.useEffect(() => {
    if (!supabase) {
      return
    }

    let mounted = true

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return
      }

      const session = data.session

      setAuthAccessToken(session?.access_token ?? null)
      setAuthState({
        email: session?.user.email ?? "",
        message: null,
        status: session ? "authenticated" : "guest",
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthAccessToken(session?.access_token ?? null)
      setAuthState({
        email: session?.user.email ?? "",
        message: null,
        status: session ? "authenticated" : "guest",
      })
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  React.useEffect(() => {
    if (
      authState.status !== "authenticated" ||
      !authAccessToken ||
      habit.synced
    ) {
      return
    }

    const storedEvent = window.sessionStorage.getItem(lastHabitEventStorageKey)

    if (!storedEvent) {
      return
    }

    let payload: HabitEventPayload

    try {
      payload = JSON.parse(storedEvent) as HabitEventPayload
    } catch {
      window.sessionStorage.removeItem(lastHabitEventStorageKey)
      return
    }

    void postHabitEvent(payload, authAccessToken).then((synced) => {
      if (!synced) {
        return
      }

      const nextHabit = {
        ...habit,
        lastSyncedAt: new Date().toISOString(),
        synced: true,
      }

      setHabit(nextHabit)
      window.sessionStorage.setItem("faye:habit", JSON.stringify(nextHabit))
    })
  }, [authAccessToken, authState.status, habit])

  React.useEffect(() => {
    if (view === "scan") {
      return
    }

    const storedAnalysis = window.sessionStorage.getItem("faye:last-analysis")

    if (!storedAnalysis) {
      return
    }

    try {
      const parsed = JSON.parse(storedAnalysis) as EveAnalysisResult

      if (parsed.status === "classified") {
        const timeout = window.setTimeout(() => {
          setAnalysisResult(parsed)
        }, 0)

        return () => {
          window.clearTimeout(timeout)
        }
      }
    } catch {
      window.sessionStorage.removeItem("faye:last-analysis")
    }
  }, [view])

  React.useEffect(() => {
    return () => {
      if (uploadPreview?.url) {
        URL.revokeObjectURL(uploadPreview.url)
      }
    }
  }, [uploadPreview?.url])

  async function setUploadFile(file: File | null) {
    if (!file) {
      setUploadPreview(null)
      setAnalysisResult(null)
      return
    }

    const imagePayload = await createImagePayload(file)

    setUploadPreview((current) => {
      if (current?.url) {
        URL.revokeObjectURL(current.url)
      }

      return {
        dataUrl: imagePayload.dataUrl,
        mediaType: imagePayload.mediaType,
        name: file.name,
        sizeLabel: `${Math.max(file.size / 1024 / 1024, 0.01).toFixed(2)} MB`,
        url: imagePayload.url,
      }
    })
    setAnalysisResult(null)
    window.sessionStorage.setItem("faye:last-upload-name", file.name)
  }

  async function analyzeResidue() {
    setPhase("analyzing")

    const minimumDelay = new Promise((resolve) => {
      window.setTimeout(resolve, 650)
    })
    const inputMode: EveInputMode = uploadPreview
      ? "image"
      : "empty"

    try {
      const response = await fetch("/api/eve/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageDataUrl: uploadPreview?.dataUrl,
          imageMediaType: uploadPreview?.mediaType,
          imageName: uploadPreview?.name,
          inputMode,
          locale: "es-PE",
        }),
      })

      if (!response.ok) {
        throw new Error("Eve classification failed")
      }

      const result = (await response.json()) as EveAnalysisResult

      if (result.status === "needs_input") {
        await minimumDelay

        setAnalysisResult(result)
        window.sessionStorage.removeItem("faye:last-analysis")
        return
      }

      await minimumDelay

      setAnalysisResult(result)
      window.sessionStorage.setItem("faye:last-analysis", JSON.stringify(result))

      if (view !== "demo") {
        router.push(`/result?source=${result.source}`)
      }
    } catch {
      await minimumDelay

      setAnalysisResult({
        status: "needs_input",
        actionLabel: "Reintentar",
        analyzedAt: new Date().toISOString(),
        fallbackReason: "No se pudo completar el analisis visual.",
        message: "No pude analizar esta imagen. Intenta otra foto mas clara.",
        source: "fallback",
        title: "Sin resultado",
      })
    } finally {
      setPhase("ready")
    }
  }

  async function recordAction() {
    if (!activeResidue || (isLogged && view === "demo")) {
      return
    }

    setPhase("recording")

    const nextHabit = {
      count: habit.count + 1,
      points: habit.points + activeResidue.points,
      progress: Math.min(100, habit.progress + 16),
      streak: Math.max(1, habit.streak),
    }
    const eventPayload: HabitEventPayload = {
      deviceId: getOrCreateDeviceId(),
      residue: {
        id: activeResidue.id,
        name: activeResidue.name,
        material: activeResidue.material,
        category: activeResidue.category,
        bin: activeResidue.bin,
        points: activeResidue.points,
        confidence: activeResidue.confidence,
        preparation: activeResidue.preparation,
        impact: activeResidue.impact,
        source: activeResidue.source,
      },
    }
    let synced = false

    try {
      synced = await postHabitEvent(eventPayload, authAccessToken)
    } catch {
      synced = false
    }

    const storedHabit = {
      ...nextHabit,
      lastSyncedAt: new Date().toISOString(),
      synced,
    }

    setPhase("logged")
    setHabit(storedHabit)
    window.sessionStorage.setItem("faye:habit", JSON.stringify(storedHabit))
    window.sessionStorage.setItem(
      lastHabitEventStorageKey,
      JSON.stringify(eventPayload)
    )

    if (view !== "demo") {
      router.push("/habit")
    }
  }

  async function requestHabitAuth(email: string) {
    const normalizedEmail = email.trim().toLowerCase()

    if (!supabase) {
      setAuthState({
        email: normalizedEmail,
        message: "Activa Supabase Auth para guardar el progreso.",
        status: "unavailable",
      })
      return
    }

    setAuthState({
      email: normalizedEmail,
      message: null,
      status: "sending",
    })

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/habit`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      setAuthState({
        email: normalizedEmail,
        message: "No pude enviar el enlace. Intenta con otro correo.",
        status: "error",
      })
      return
    }

    setAuthState({
      email: normalizedEmail,
      message: "Te enviamos un enlace para guardar tu progreso.",
      status: "sent",
    })
  }

  function goToPreviousStep() {
    if (!canGoBack) {
      return
    }

    if (view === "habit") {
      router.push("/result")
      return
    }

    router.push("/scan")
  }

  function goToNextStep() {
    if (!canGoForward) {
      return
    }

    if (view === "scan") {
      router.push("/result")
      return
    }

    if (view === "result") {
      router.push("/habit")
    }
  }

  return (
    <main className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="grid h-full grid-rows-[48px_minmax(0,1fr)] overflow-hidden sm:grid-rows-[52px_minmax(0,1fr)]">
        <FayeTopBar
          authState={authState}
          view={view}
        />

        <section className="grid h-full min-h-0 grid-rows-[36px_minmax(0,1fr)] overflow-hidden px-2 pb-2 sm:grid-rows-[40px_minmax(0,1fr)] sm:px-3 sm:pb-3">
          <FayeMainHeader
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            flowStarted={flowStarted}
            onBack={goToPreviousStep}
            onForward={goToNextStep}
            view={view}
          />

          <div className="min-h-0 overflow-hidden">
            {view === "scan" ? (
              <ScanPanel
                uploadPreview={uploadPreview}
                phase={phase}
                inputNotice={inputNotice}
                onAnalyze={analyzeResidue}
                onUploadFile={setUploadFile}
              />
            ) : null}

            {view === "result" ? (
              <div className="grid h-full min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                {activeResidue ? (
                  <>
                    <ResultPanel
                      selectedResidue={activeResidue}
                      phase={phase}
                      source={activeSource}
                      onAnalyze={analyzeResidue}
                      onRecord={recordAction}
                    />
                    <div className="hidden min-h-0 lg:block">
                      <HabitPanel
                        selectedResidue={activeResidue}
                        phase={phase}
                        habit={habit}
                        authState={authState}
                        onSaveWithEmail={requestHabitAuth}
                        compact
                      />
                    </div>
                  </>
                ) : (
                  <EmptyWorkspace
                    actionHref="/scan"
                    actionLabel="Subir imagen"
                    className="lg:col-span-2"
                    title="Sin resultado"
                  />
                )}
              </div>
            ) : null}

            {view === "habit" ? (
              <div className="grid h-full min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                {activeResidue ? (
                  <>
                    <HabitPanel
                      selectedResidue={activeResidue}
                      phase="logged"
                      habit={habit}
                      authState={authState}
                      onSaveWithEmail={requestHabitAuth}
                    />
                    <div className="hidden min-h-0 lg:block">
                      <ResultSummary selectedResidue={activeResidue} />
                    </div>
                  </>
                ) : (
                  <EmptyWorkspace
                    actionHref="/scan"
                    actionLabel="Subir imagen"
                    className="lg:col-span-2"
                    title="Sin registros"
                  />
                )}
              </div>
            ) : null}

            {view === "demo" ? (
              <div className="grid h-full min-h-0 gap-3 overflow-hidden xl:grid-cols-[minmax(0,1fr)_390px_300px]">
                <ScanPanel
                  uploadPreview={uploadPreview}
                  phase={phase}
                  inputNotice={inputNotice}
                  onAnalyze={analyzeResidue}
                  onUploadFile={setUploadFile}
                  compact
                />
                {activeResidue ? (
                  <>
                    <div className="hidden min-h-0 xl:block">
                      <ResultPanel
                        selectedResidue={activeResidue}
                        phase={phase}
                        source={analysisResult?.source ?? (uploadPreview ? "upload" : null)}
                        onAnalyze={analyzeResidue}
                        onRecord={recordAction}
                        compact
                      />
                    </div>
                    <div className="hidden min-h-0 xl:block">
                      <HabitPanel
                        selectedResidue={activeResidue}
                        phase={phase}
                        habit={habit}
                        authState={authState}
                        onSaveWithEmail={requestHabitAuth}
                        compact
                      />
                    </div>
                  </>
                ) : (
                  <EmptyWorkspace
                    actionHref="/scan"
                    actionLabel="Subir imagen"
                    className="xl:col-span-2"
                    title="Sin resultado"
                  />
                )}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}

function FayeTopBar({
  authState,
  view,
}: {
  authState: HabitAuthState
  view: FayeView
}) {
  const viewLabel =
    view === "result" ? "Result" : view === "habit" ? "Habit" : "Scan"
  const accountLabel =
    authState.status === "authenticated" ? "Cuenta" : "Invitado"

  return (
    <header className="grid h-12 grid-cols-[1fr_auto_1fr] items-center px-2 sm:h-13 sm:px-3">
      <div className="flex min-w-0 items-center gap-1.5">
        <Button size="sm" variant="ghost">
          Feedback
        </Button>
      </div>

      <div className="grid place-items-center">
        <div className="grid size-7 place-items-center rounded-full border border-border bg-card/30 sm:hidden">
          <FayeLogo className="size-4" />
        </div>
        <p className="hidden text-xs font-semibold sm:block">{viewLabel}</p>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-1.5">
        <Badge variant={authState.status === "authenticated" ? "secondary" : "outline"}>
          {accountLabel}
        </Badge>
      </div>
    </header>
  )
}

function FayeMainHeader({
  canGoBack,
  canGoForward,
  flowStarted,
  onBack,
  onForward,
  view,
}: {
  canGoBack: boolean
  canGoForward: boolean
  flowStarted: boolean
  onBack: () => void
  onForward: () => void
  view: FayeView
}) {
  const viewLabel =
    view === "result" ? "Resultado" : view === "habit" ? "Habito" : "Entrada"

  return (
    <div className="flex min-h-0 items-center justify-between gap-3 px-1">
      <p className="truncate text-xs font-medium text-muted-foreground">
        {viewLabel}
      </p>

      {flowStarted ? (
        <div
          aria-label="Flujo"
          className="flex items-center gap-1 rounded-md border border-border bg-card/20 p-0.5"
        >
          <Button
            aria-label="Volver al paso anterior"
            disabled={!canGoBack}
            onClick={onBack}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
          </Button>
          <Button
            aria-label="Avanzar al siguiente paso"
            disabled={!canGoForward}
            onClick={onForward}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function ScanPanel({
  uploadPreview,
  phase,
  inputNotice,
  onAnalyze,
  onUploadFile,
  compact = false,
}: {
  uploadPreview: UploadPreview | null
  phase: Phase
  inputNotice: EveEmptyInputResponse | null
  onAnalyze: () => void
  onUploadFile: (file: File | null) => void | Promise<void>
  compact?: boolean
}) {
  const isAnalyzing = phase === "analyzing"

  return (
    <section
      className={cn(
        "grid h-full min-h-0 overflow-hidden",
        uploadPreview || isAnalyzing
          ? compact
            ? "grid-rows-[minmax(0,1fr)_auto]"
            : "grid-rows-[minmax(0,1fr)_56px] sm:grid-rows-[minmax(0,1fr)_64px]"
          : "grid-rows-[minmax(0,1fr)]"
      )}
    >
      <FayeDropzone
        isAnalyzing={isAnalyzing}
        notice={inputNotice}
        onFile={onUploadFile}
        preview={uploadPreview}
      />

      {uploadPreview || isAnalyzing ? (
        <div className="flex min-h-0 items-center justify-center pt-2 sm:pt-3">
          <Button
            size="lg"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            data-testid="analyze-residue"
            className="h-10 px-4 sm:h-11"
          >
            <HugeiconsIcon icon={isAnalyzing ? SparklesIcon : AiScanIcon} data-icon="inline-start" />
            {isAnalyzing ? "Analizando" : "Analizar"}
          </Button>
        </div>
      ) : null}
    </section>
  )
}

function ResultPanel({
  selectedResidue,
  phase,
  source,
  onAnalyze,
  onRecord,
  compact = false,
}: {
  selectedResidue: DisplayResidue
  phase: Phase
  source: string | null
  onAnalyze: () => void
  onRecord: () => void
  compact?: boolean
}) {
  const isAnalyzing = phase === "analyzing"
  const isRecording = phase === "recording"

  return (
    <section className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-border bg-card/20">
      <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden p-3 sm:p-4">
        <div className="grid min-h-0 place-items-center">
          <div className="w-full max-w-xl sm:max-w-2xl">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-8">
              <Marker className="min-w-0 flex-1 sm:max-w-sm">
                <MarkerIcon>
                  <HugeiconsIcon
                    icon={isAnalyzing ? SparklesIcon : getResidueIcon(selectedResidue.id)}
                  />
                </MarkerIcon>
                <MarkerContent>
                  {isAnalyzing ? "Analizando" : sourceLabel(source)}
                </MarkerContent>
              </Marker>
              <Badge className="shrink-0" variant={isAnalyzing ? "secondary" : "outline"}>
                {isAnalyzing ? "IA" : `${selectedResidue.confidence}%`}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">Tipo</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl">
              {isAnalyzing ? "Analizando" : residueKind(selectedResidue)}
            </h1>
            <p className="mt-3 text-base font-medium text-muted-foreground sm:text-lg">
              {isAnalyzing ? "" : selectedResidue.name}
            </p>
            <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-6 sm:line-clamp-4">
              {isAnalyzing ? "" : selectedResidue.rationale}
            </p>
          </div>
        </div>

        <div className={cn("grid gap-2", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3")}>
          <ResultFact label="Material" value={selectedResidue.material} />
          <ResultFact label="Destino" value={selectedResidue.bin} />
          <ResultFact label="Puntos" value={selectedResidue.reward} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border p-2 sm:p-3">
        <Button
          variant="outline"
          onClick={onAnalyze}
          disabled={isAnalyzing || isRecording}
          className="h-9"
        >
          <HugeiconsIcon icon={AiScanIcon} data-icon="inline-start" />
          Reanalizar
        </Button>
        <Button
          onClick={onRecord}
          disabled={isAnalyzing || isRecording}
          data-testid="record-action"
          className="h-9"
        >
          <HugeiconsIcon
            icon={isRecording ? SparklesIcon : CheckmarkCircle02Icon}
            data-icon="inline-start"
          />
          {isRecording ? "Registrando" : "Registrar"}
        </Button>
      </div>
    </section>
  )
}

function HabitPanel({
  authState,
  selectedResidue,
  phase,
  habit,
  onSaveWithEmail,
  compact = false,
}: {
  authState: HabitAuthState
  selectedResidue: DisplayResidue
  phase: Phase
  habit: StoredHabit
  onSaveWithEmail: (email: string) => void | Promise<void>
  compact?: boolean
}) {
  const isLogged = phase === "logged" || habit.count > 0

  return (
    <section className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border border-border bg-card/20">
      <div className="flex h-12 items-center justify-between gap-3 px-3">
        <p className="text-xs font-semibold">Habit</p>
        <div className="flex items-center gap-1">
          {habit.count > 0 ? (
            <Badge variant="secondary">Registrado</Badge>
          ) : null}
          <Badge variant="outline">{habit.points} pts</Badge>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-3 overflow-hidden p-3 pt-0 sm:gap-4">
        <Progress value={habit.progress}>
          <ProgressLabel>Meta semanal</ProgressLabel>
          <ProgressValue />
        </Progress>

        <div className="grid grid-cols-2 gap-2">
          <StatBlock label="Racha" value={`${habit.streak} dias`} />
          <StatBlock label="Acciones" value={`${habit.count}`} />
        </div>

        <div className="min-h-0 rounded-md border border-border bg-background/40 p-3">
          <p className="text-xs font-medium">
            Accion
          </p>
          <p
            className={cn(
              "mt-2 text-sm leading-6 text-muted-foreground",
              compact ? "line-clamp-4" : "line-clamp-6"
            )}
          >
            {isLogged
              ? selectedResidue.habit
              : selectedResidue.preparation}
          </p>
        </div>

        <div className="min-h-0 rounded-md border border-border bg-background/40 p-3">
          <p className="text-xs font-medium">Impacto</p>
          <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
            {selectedResidue.impact}
          </p>
        </div>

        {!compact && habit.count > 0 ? (
          <HabitAuthPanel
            authState={authState}
            onSaveWithEmail={onSaveWithEmail}
          />
        ) : null}

        {!compact ? (
          <div className="hidden grid-cols-3 gap-2 sm:grid">
            <ImpactRow label="Recuperados" value={`${habit.count}`} />
            <ImpactRow
              label="CO2e"
              value={isLogged ? selectedResidue.impact.match(/\d+\s*g/)?.[0] ?? "Estimado" : "0 g"}
            />
            <ImpactRow label="Errores" value="0" />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function HabitAuthPanel({
  authState,
  onSaveWithEmail,
}: {
  authState: HabitAuthState
  onSaveWithEmail: (email: string) => void | Promise<void>
}) {
  const [email, setEmail] = React.useState(authState.email)
  const isAuthenticated = authState.status === "authenticated"
  const isSending = authState.status === "sending"
  const isSent = authState.status === "sent"
  const hasError = authState.status === "error"

  if (isAuthenticated) {
    return (
      <div className="rounded-md border border-border bg-background/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium">Progreso vinculado</p>
          <Badge variant="secondary">Cuenta</Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {authState.email || "Tu correo"} conservara los registros de habito.
        </p>
      </div>
    )
  }

  if (isSent) {
    return (
      <div className="rounded-md border border-border bg-background/40 p-3">
        <p className="text-xs font-medium">Revisa tu correo</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {authState.message ?? "Enlace enviado."}
        </p>
      </div>
    )
  }

  return (
    <form
      className="rounded-md border border-border bg-background/40 p-3"
      onSubmit={(event) => {
        event.preventDefault()
        void onSaveWithEmail(email)
      }}
    >
      <FieldGroup className="gap-2">
        <Field data-invalid={hasError || undefined}>
          <FieldLabel htmlFor="habit-email">Guardar progreso</FieldLabel>
          <FieldDescription>
            Enviaremos un enlace para asociar este habito a tu correo.
          </FieldDescription>
          <div className="flex gap-2">
            <Input
              aria-invalid={hasError || undefined}
              autoComplete="email"
              disabled={isSending}
              id="habit-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              required
              type="email"
              value={email}
            />
            <Button disabled={isSending} type="submit">
              {isSending ? "Enviando" : "Guardar"}
            </Button>
          </div>
          {hasError && authState.message ? (
            <FieldError>{authState.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
    </form>
  )
}

function ResultFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-5">{value}</p>
    </div>
  )
}

function ResultSummary({ selectedResidue }: { selectedResidue: DisplayResidue }) {
  return (
    <section className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-border bg-card/20">
      <div className="flex h-12 items-center justify-between gap-3 border-b border-border px-3">
        <p className="text-xs font-medium">Ultimo registro</p>
        <Badge variant="secondary">{selectedResidue.confidence}%</Badge>
      </div>

      <div className="grid min-h-0 place-items-center p-3">
        <div className="w-full max-w-lg">
          <p className="text-xs text-muted-foreground">Residuo</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            {selectedResidue.name}
          </h1>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <DecisionMetric
              label="Tipo"
              value={residueKind(selectedResidue)}
              icon={getResidueIcon(selectedResidue.id)}
            />
            <DecisionMetric label="Destino" value={selectedResidue.bin} icon={WasteIcon} />
          </div>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <Link className={cn(buttonVariants(), "w-full")} href="/scan">
          Clasificar otro
        </Link>
      </div>
    </section>
  )
}

function EmptyWorkspace({
  actionHref,
  actionLabel,
  className,
  title,
}: {
  actionHref: string
  actionLabel: string
  className?: string
  title: string
}) {
  return (
    <section
      className={cn(
        "grid h-full min-h-0 place-items-center overflow-hidden rounded-lg border border-border bg-card/20",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="grid size-10 place-items-center rounded-full border border-border bg-muted/30">
          <HugeiconsIcon icon={SparklesIcon} size={18} />
        </div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Link className={buttonVariants()} href={actionHref}>
          {actionLabel}
        </Link>
      </div>
    </section>
  )
}

function DecisionMetric({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: typeof Recycle01Icon
}) {
  return (
    <div className="flex min-h-20 flex-col justify-between overflow-hidden rounded-md border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <HugeiconsIcon icon={icon} size={16} />
      </div>
      <p className="line-clamp-2 text-sm font-medium leading-5">{value}</p>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function ImpactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{value}</p>
    </div>
  )
}
