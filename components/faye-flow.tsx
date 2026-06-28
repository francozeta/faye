"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AiScanIcon,
  CameraAiIcon,
  ChartUpIcon,
  CheckmarkCircle02Icon,
  Leaf01Icon,
  Recycle01Icon,
  SparklesIcon,
  WasteIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { FayeLogo } from "@/components/faye-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { demoResidues, type DemoResidue } from "@/lib/demo-residues"
import { cn } from "@/lib/utils"

type FayeView = "scan" | "result" | "habit" | "demo"
type Phase = "ready" | "analyzing" | "logged"
type UploadPreview = {
  name: string
  sizeLabel: string
  url: string
}

const scenarioIcons = {
  "pet-bottle": Recycle01Icon,
  "paper-receipt": WasteIcon,
  "organic-scraps": Leaf01Icon,
} satisfies Record<DemoResidue["id"], typeof Recycle01Icon>

const navItems: Array<{ href: string; label: string; view: FayeView }> = [
  { href: "/scan", label: "Entrada", view: "scan" },
  { href: "/result", label: "Resultado", view: "result" },
  { href: "/habit", label: "Habito", view: "habit" },
  { href: "/demo", label: "Demo", view: "demo" },
]

export function FayeFlow({
  view,
  initialResidueId,
  source = null,
}: {
  view: FayeView
  initialResidueId?: string | null
  source?: string | null
}) {
  const router = useRouter()
  const routeResidue = demoResidues.find(
    (residue) => residue.id === initialResidueId
  )
  const [selectedId, setSelectedId] = React.useState<DemoResidue["id"]>(
    routeResidue?.id ?? "pet-bottle"
  )
  const [phase, setPhase] = React.useState<Phase>(
    view === "habit" ? "logged" : "ready"
  )
  const [loggedCount, setLoggedCount] = React.useState(view === "habit" ? 9 : 8)
  const [uploadPreview, setUploadPreview] = React.useState<UploadPreview | null>(
    null
  )

  const selectedResidue =
    demoResidues.find((residue) => residue.id === selectedId) ?? demoResidues[0]
  const isLogged = phase === "logged" || view === "habit"
  const progress = isLogged ? 76 : 64
  const streak = isLogged ? 4 : 3
  const points = 146 + (isLogged ? selectedResidue.points : 0)

  React.useEffect(() => {
    return () => {
      if (uploadPreview?.url) {
        URL.revokeObjectURL(uploadPreview.url)
      }
    }
  }, [uploadPreview?.url])

  function selectResidue(nextValue: DemoResidue["id"]) {
    setSelectedId(nextValue)
    setPhase("ready")
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      setUploadPreview(null)
      return
    }

    setUploadPreview((current) => {
      if (current?.url) {
        URL.revokeObjectURL(current.url)
      }

      return {
        name: file.name,
        sizeLabel: `${Math.max(file.size / 1024 / 1024, 0.01).toFixed(2)} MB`,
        url: URL.createObjectURL(file),
      }
    })
    window.sessionStorage.setItem("faye:last-upload-name", file.name)
  }

  function analyzeResidue() {
    setPhase("analyzing")

    window.setTimeout(() => {
      setPhase("ready")

      if (view !== "demo") {
        const source = uploadPreview ? "&source=upload" : ""
        router.push(`/result?item=${selectedId}${source}`)
      }
    }, 650)
  }

  function recordAction() {
    if (isLogged && view === "demo") {
      return
    }

    setPhase("logged")
    setLoggedCount((current) => Math.max(current, 8) + 1)

    if (view !== "demo") {
      router.push(`/habit?item=${selectedId}`)
    }
  }

  return (
    <TooltipProvider>
      <main className="min-h-dvh bg-background text-foreground">
        <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <AppHeader activeView={view} />

          <section
            className={cn(
              "grid flex-1 gap-4 py-4",
              view === "demo"
                ? "lg:grid-cols-[280px_minmax(0,1fr)_340px]"
                : "lg:grid-cols-[minmax(0,1fr)_340px]"
            )}
          >
            {view === "scan" && (
              <>
                <ScanPanel
                  selectedResidue={selectedResidue}
                  selectedId={selectedId}
                  uploadPreview={uploadPreview}
                  phase={phase}
                  onAnalyze={analyzeResidue}
                  onSelectResidue={selectResidue}
                  onUpload={handleUpload}
                />
                <FlowAside />
              </>
            )}

            {view === "result" && (
              <>
                <ResultPanel
                  selectedResidue={selectedResidue}
                  phase={phase}
                  source={source}
                  onAnalyze={analyzeResidue}
                  onRecord={recordAction}
                />
                <HabitPanel
                  selectedResidue={selectedResidue}
                  phase={phase}
                  loggedCount={loggedCount}
                  points={points}
                  progress={progress}
                  streak={streak}
                  compact
                />
              </>
            )}

            {view === "habit" && (
              <>
                <HabitPanel
                  selectedResidue={selectedResidue}
                  phase="logged"
                  loggedCount={loggedCount}
                  points={points}
                  progress={progress}
                  streak={streak}
                />
                <ResultSummary selectedResidue={selectedResidue} />
              </>
            )}

            {view === "demo" && (
              <>
                <ScanPanel
                  selectedResidue={selectedResidue}
                  selectedId={selectedId}
                  uploadPreview={uploadPreview}
                  phase={phase}
                  onAnalyze={analyzeResidue}
                  onSelectResidue={selectResidue}
                  onUpload={handleUpload}
                  compact
                />
                <ResultPanel
                  selectedResidue={selectedResidue}
                  phase={phase}
                  source={uploadPreview ? "upload" : null}
                  onAnalyze={analyzeResidue}
                  onRecord={recordAction}
                  compact
                />
                <HabitPanel
                  selectedResidue={selectedResidue}
                  phase={phase}
                  loggedCount={loggedCount}
                  points={points}
                  progress={progress}
                  streak={streak}
                  compact
                />
              </>
            )}
          </section>
        </div>
      </main>
    </TooltipProvider>
  )
}

function AppHeader({ activeView }: { activeView: FayeView }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/70 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md border border-border bg-card">
          <span className="sr-only">FAYE</span>
          <FayeLogo className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">FAYE</p>
            <Badge variant="outline">Beta privada</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Clasifica residuos, registra habitos y muestra impacto.
          </p>
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-2" aria-label="FAYE">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex h-7 items-center rounded-md border border-border px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              activeView === item.view && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function ScanPanel({
  selectedResidue,
  selectedId,
  uploadPreview,
  phase,
  onAnalyze,
  onSelectResidue,
  onUpload,
  compact = false,
}: {
  selectedResidue: DemoResidue
  selectedId: DemoResidue["id"]
  uploadPreview: UploadPreview | null
  phase: Phase
  onAnalyze: () => void
  onSelectResidue: (id: DemoResidue["id"]) => void
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  compact?: boolean
}) {
  return (
    <Card className={cn(!compact && "min-h-[620px]")}>
      <CardHeader>
        <CardTitle>Entrada</CardTitle>
        <CardDescription>
          Toma una foto, sube una imagen o usa un residuo demo.
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button size="icon" variant="ghost" aria-label="Entrada con imagen">
                  <HugeiconsIcon icon={CameraAiIcon} />
                </Button>
              }
            />
            <TooltipContent>La foto se procesa localmente en esta fase.</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className={cn("grid gap-4", !compact && "lg:grid-cols-[1fr_280px]")}>
        <div className="flex min-h-96 flex-col justify-between rounded-md border border-border bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{uploadPreview ? "Imagen subida" : "Vista demo"}</Badge>
            <Badge variant="secondary">{selectedResidue.material}</Badge>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            {uploadPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={uploadPreview.url}
                alt={`Residuo subido: ${uploadPreview.name}`}
                className="max-h-72 w-full max-w-md rounded-md border border-border object-contain"
              />
            ) : (
              <div className="grid size-48 place-items-center rounded-md border border-border bg-card">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="grid size-14 place-items-center rounded-md bg-muted">
                    <HugeiconsIcon icon={scenarioIcons[selectedResidue.id]} size={28} />
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">{selectedResidue.visual.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedResidue.visual.detail}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="truncate">
              {uploadPreview ? uploadPreview.name : selectedResidue.shortName}
            </span>
            <span>{uploadPreview ? uploadPreview.sizeLabel : `${selectedResidue.confidence}% match`}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="residue-photo">Imagen del residuo</FieldLabel>
              <Input
                id="residue-photo"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onUpload}
              />
              <FieldDescription>
                En esta etapa FAYE muestra preview local; el analisis real se enchufa luego al gateway.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium">Escenario demo seguro</p>
            <ToggleGroup
              multiple={false}
              value={[selectedId]}
              onValueChange={(value) => {
                const nextValue = value.at(-1)

                if (
                  nextValue &&
                  demoResidues.some((residue) => residue.id === nextValue)
                ) {
                  onSelectResidue(nextValue as DemoResidue["id"])
                }
              }}
              orientation="vertical"
              className="w-full items-stretch"
            >
              {demoResidues.map((residue) => (
                <ToggleGroupItem
                  key={residue.id}
                  value={residue.id}
                  variant="outline"
                  data-testid={`residue-${residue.id}`}
                  className="h-auto w-full justify-start px-3 py-2 text-left"
                >
                  <HugeiconsIcon icon={scenarioIcons[residue.id]} data-icon="inline-start" />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{residue.shortName}</span>
                    <span className="truncate text-muted-foreground">
                      {residue.category}
                    </span>
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Button
            size="lg"
            onClick={onAnalyze}
            disabled={phase === "analyzing"}
            data-testid="analyze-residue"
            className="w-full"
          >
            <HugeiconsIcon icon={AiScanIcon} data-icon="inline-start" />
            {phase === "analyzing" ? "Analizando" : "Analizar residuo"}
          </Button>
        </div>
      </CardContent>
    </Card>
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
  selectedResidue: DemoResidue
  phase: Phase
  source: string | null
  onAnalyze: () => void
  onRecord: () => void
  compact?: boolean
}) {
  return (
    <Card className={cn(!compact && "min-h-[620px]")}>
      <CardHeader>
        <CardTitle>Clasificacion</CardTitle>
        <CardDescription>
          FAYE transforma la incertidumbre en una accion concreta.
        </CardDescription>
        <CardAction>
          <Badge variant={phase === "analyzing" ? "secondary" : "default"}>
            {phase === "analyzing" ? "Analizando" : source === "upload" ? "Imagen" : "Demo"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex min-h-32 flex-col justify-between rounded-md border border-border bg-muted/20 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-md bg-card">
                <HugeiconsIcon
                  icon={phase === "analyzing" ? AiScanIcon : SparklesIcon}
                  size={20}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {phase === "analyzing"
                    ? "FAYE esta revisando forma, material y contexto."
                    : `Resultado probable: ${selectedResidue.name}`}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {phase === "analyzing"
                    ? "El motor interno compara senales visuales y usa fallback demo si algo falla."
                    : selectedResidue.rationale}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xl font-semibold tabular-nums">
                {phase === "analyzing" ? "..." : `${selectedResidue.confidence}%`}
              </p>
              <p className="text-xs text-muted-foreground">confianza</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <DecisionMetric
            label="Categoria"
            value={selectedResidue.category}
            icon={Recycle01Icon}
          />
          <DecisionMetric label="Destino" value={selectedResidue.bin} icon={WasteIcon} />
          <DecisionMetric
            label="Recompensa"
            value={selectedResidue.reward}
            icon={CheckmarkCircle02Icon}
          />
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium">Accion recomendada</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {selectedResidue.preparation}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Leaf01Icon} size={16} />
              <p className="text-xs font-medium">Impacto inmediato</p>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              {selectedResidue.impact}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button
            size="lg"
            variant="outline"
            onClick={onAnalyze}
            disabled={phase === "analyzing"}
            className="flex-1"
          >
            <HugeiconsIcon icon={AiScanIcon} data-icon="inline-start" />
            Reanalizar
          </Button>
          <Button
            size="lg"
            onClick={onRecord}
            disabled={phase === "analyzing"}
            data-testid="record-action"
            className="flex-1"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
            Registrar accion
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function HabitPanel({
  selectedResidue,
  phase,
  loggedCount,
  points,
  progress,
  streak,
  compact = false,
}: {
  selectedResidue: DemoResidue
  phase: Phase
  loggedCount: number
  points: number
  progress: number
  streak: number
  compact?: boolean
}) {
  const isLogged = phase === "logged"

  return (
    <Card className={cn(!compact && "min-h-[620px]")}>
      <CardHeader>
        <CardTitle>Habito</CardTitle>
        <CardDescription>Progreso visible para repetir la accion.</CardDescription>
        <CardAction>
          <Badge variant="outline">{points} pts</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Tabs defaultValue="today">
          <TabsList className="w-full">
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="impact">Impacto</TabsTrigger>
            <TabsTrigger value="flow">Flujo</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="flex flex-col gap-4 pt-2">
            <Progress value={progress}>
              <ProgressLabel>Meta semanal</ProgressLabel>
              <ProgressValue />
            </Progress>
            <div className="grid grid-cols-2 gap-3">
              <StatBlock label="Racha" value={`${streak} dias`} />
              <StatBlock label="Acciones" value={`${loggedCount}`} />
            </div>
            <div className="rounded-md border border-border bg-muted/20 p-3">
              <p className="text-xs font-medium">Registro de FAYE</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isLogged
                  ? selectedResidue.habit
                  : "Cuando registres la accion, FAYE la suma a tu habito y ajusta el progreso."}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="impact" className="flex flex-col gap-3 pt-2">
            <ImpactRow label="Residuos recuperados" value={isLogged ? "9" : "8"} />
            <ImpactRow label="CO2e estimado" value={isLogged ? "146 g" : "128 g"} />
            <ImpactRow label="Errores evitados" value="3" />
            <div className="rounded-md border border-border bg-muted/20 p-3">
              <p className="text-xs leading-5 text-muted-foreground">
                Cada clasificacion correcta alimenta recomendaciones mas precisas para el hogar.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="flow" className="flex flex-col gap-3 pt-2">
            <FlowStep index="01" title="Descubrir" description="Foto o residuo seleccionado." />
            <FlowStep index="02" title="Entender" description="FAYE identifica y explica." />
            <FlowStep index="03" title="Actuar" description="El usuario sigue el paso." />
            <FlowStep index="04" title="Repetir" description="La accion cuenta como habito." />
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
            <HugeiconsIcon icon={ChartUpIcon} size={18} />
          </div>
          <div>
            <p className="text-xs font-medium">Ciclo completo</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Duda resuelta, accion registrada e impacto visible en una sola experiencia.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FlowAside() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Como funciona</CardTitle>
        <CardDescription>Una ruta corta, clara y demo-safe.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <FlowStep index="01" title="Entrada" description="Imagen o residuo demo." />
        <FlowStep index="02" title="Clasificacion" description="FAYE devuelve categoria y accion." />
        <FlowStep index="03" title="Registro" description="La accion suma a tu habito." />
        <FlowStep index="04" title="Impacto" description="El progreso se vuelve visible." />
      </CardContent>
    </Card>
  )
}

function ResultSummary({ selectedResidue }: { selectedResidue: DemoResidue }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ultima clasificacion</CardTitle>
        <CardDescription>Resumen del residuo registrado.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DecisionMetric
          label="Residuo"
          value={selectedResidue.name}
          icon={scenarioIcons[selectedResidue.id]}
        />
        <DecisionMetric label="Destino" value={selectedResidue.bin} icon={WasteIcon} />
        <Link
          href={`/scan?item=${selectedResidue.id}`}
          className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium hover:bg-muted"
        >
          Clasificar otro residuo
        </Link>
      </CardContent>
    </Card>
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
    <div className="flex min-h-24 flex-col justify-between rounded-md border border-border bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <HugeiconsIcon icon={icon} size={16} />
      </div>
      <p className="text-sm font-medium leading-5">{value}</p>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function ImpactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}

function FlowStep({
  index,
  title,
  description,
}: {
  index: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-muted/20 p-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-card text-xs font-medium tabular-nums">
        {index}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
