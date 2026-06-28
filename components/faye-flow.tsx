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

const workspaceCopy: Record<
  FayeView,
  { title: string; description: string; badge: string }
> = {
  scan: {
    title: "FAYE",
    description: "Escanea, clasifica y registra.",
    badge: "Captura",
  },
  result: {
    title: "FAYE",
    description: "Decision lista para actuar.",
    badge: "Resultado",
  },
  habit: {
    title: "FAYE",
    description: "Habito e impacto.",
    badge: "Progreso",
  },
  demo: {
    title: "FAYE demo",
    description: "Escanear -> clasificar -> registrar.",
    badge: "Jurado",
  },
}

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
      <main className="h-dvh overflow-hidden bg-background text-foreground">
        <div className="grid h-dvh w-full grid-rows-[auto_minmax(0,1fr)] items-stretch gap-2 overflow-hidden p-2 lg:grid-cols-[204px_minmax(0,1fr)] lg:grid-rows-1 lg:gap-3 lg:p-4">
          <AppHeader
            activeView={view}
            selectedResidue={selectedResidue}
            points={points}
            progress={progress}
          />

          <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card/30 shadow-sm lg:h-[calc(100dvh-2rem)]">
            <WorkspaceHeader view={view} selectedResidue={selectedResidue} />

            <div
              className={cn(
                "grid min-h-0 flex-1 gap-3 overflow-hidden p-3",
                view === "demo"
                  ? "xl:grid-cols-[260px_minmax(0,1fr)_320px]"
                  : "xl:grid-cols-[minmax(0,1fr)_320px]"
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
            </div>
          </section>
        </div>
      </main>
    </TooltipProvider>
  )
}

function AppHeader({
  activeView,
  selectedResidue,
  points,
  progress,
}: {
  activeView: FayeView
  selectedResidue: DemoResidue
  points: number
  progress: number
}) {
  return (
    <aside className="flex min-h-0 flex-col gap-2 rounded-lg border border-border bg-card/40 p-2 lg:h-[calc(100dvh-2rem)] lg:gap-3 lg:p-3">
      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/60 px-2 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md border border-border bg-muted/30">
            <FayeLogo className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold">FAYE</p>
            <p className="truncate text-[0.625rem] text-muted-foreground">
              Clasifica residuos
            </p>
          </div>
        </div>
        <Badge variant="outline">Beta</Badge>
      </div>

      <nav
        className="grid gap-1 sm:grid-cols-4 lg:grid-cols-1"
        aria-label="FAYE workspace"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-8 items-center justify-between rounded-md border border-transparent px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              activeView === item.view &&
                "border-border bg-muted text-foreground"
            )}
          >
            <span>{item.label}</span>
            {activeView === item.view ? (
              <span className="size-1.5 rounded-full bg-foreground" />
            ) : null}
          </Link>
        ))}
      </nav>

      <Separator className="hidden lg:block" />

      <div className="hidden flex-col gap-3 lg:flex">
        <SidebarMetric label="Residuo" value={selectedResidue.shortName} />
        <SidebarMetric label="Progreso" value={`${progress}%`} />
        <SidebarMetric label="Puntos" value={`${points}`} />
      </div>

    </aside>
  )
}

function WorkspaceHeader({
  view,
  selectedResidue,
}: {
  view: FayeView
  selectedResidue: DemoResidue
}) {
  const copy = workspaceCopy[view]

  return (
    <div className="flex min-h-11 items-center justify-between gap-3 border-b border-border px-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold">{copy.title}</p>
          <Badge variant="secondary">{copy.badge}</Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{copy.description}</p>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <Badge variant="outline">{selectedResidue.material}</Badge>
        <Badge variant="outline">{selectedResidue.confidence}%</Badge>
      </div>
    </div>
  )
}

function SidebarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-2">
      <p className="text-[0.625rem] text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-xs font-medium">{value}</p>
    </div>
  )
}

function PanelHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
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
    <section className="flex h-full min-h-0 flex-col gap-3">
      <PanelHeader
        title="Entrada"
        description="Foto, archivo o demo."
        action={
          <Tooltip>
            <TooltipTrigger
              render={
                <Button size="icon" variant="ghost" aria-label="Entrada con imagen">
                  <HugeiconsIcon icon={CameraAiIcon} />
                </Button>
              }
            />
            <TooltipContent>Entrada visual del residuo.</TooltipContent>
          </Tooltip>
        }
      />
      <div
        className={cn(
          "grid min-h-0 flex-1 gap-3",
          !compact && "lg:grid-cols-[1fr_280px]"
        )}
      >
        <div className="flex min-h-0 flex-col justify-between rounded-md border border-border bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{uploadPreview ? "Imagen subida" : "Vista demo"}</Badge>
            <Badge variant="secondary">{selectedResidue.material}</Badge>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            {uploadPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={uploadPreview.url}
                alt={`Residuo subido: ${uploadPreview.name}`}
                className={cn(
                  "w-full rounded-md border border-border object-contain",
                  compact ? "max-h-40" : "max-h-64 max-w-md"
                )}
              />
            ) : (
              <div
                className={cn(
                  "grid place-items-center rounded-md border border-border bg-card",
                  compact ? "size-36" : "size-48"
                )}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="grid size-12 place-items-center rounded-md bg-muted">
                    <HugeiconsIcon icon={scenarioIcons[selectedResidue.id]} size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{selectedResidue.visual.label}</p>
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
            <span className="shrink-0">{uploadPreview ? uploadPreview.sizeLabel : `${selectedResidue.confidence}%`}</span>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          {!compact ? (
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
                <FieldDescription>Preview local para la demo.</FieldDescription>
              </Field>
            </FieldGroup>
          ) : null}

          <div className={cn("flex flex-col gap-2", compact && "hidden")}>
            <p className="text-xs font-medium">Residuo demo</p>
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
            size={compact ? "default" : "lg"}
            onClick={onAnalyze}
            disabled={phase === "analyzing"}
            data-testid="analyze-residue"
            className="mt-auto w-full"
          >
            <HugeiconsIcon icon={AiScanIcon} data-icon="inline-start" />
            {phase === "analyzing" ? "Analizando" : "Analizar"}
          </Button>
        </div>
      </div>
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
  selectedResidue: DemoResidue
  phase: Phase
  source: string | null
  onAnalyze: () => void
  onRecord: () => void
  compact?: boolean
}) {
  return (
    <section className="flex h-full min-h-0 flex-col gap-3">
      <PanelHeader
        title="Clasificacion"
        description="Destino y accion."
        action={
          <Badge variant={phase === "analyzing" ? "secondary" : "default"}>
            {phase === "analyzing" ? "Analizando" : source === "upload" ? "Imagen" : "Demo"}
          </Badge>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex min-h-0 flex-col justify-between rounded-md border border-border bg-muted/20 p-3">
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
                    ? "Analizando residuo"
                    : `Resultado probable: ${selectedResidue.name}`}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {phase === "analyzing"
                    ? "FAYE compara senales visuales y prepara una accion."
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

        <div className="grid gap-2 md:grid-cols-3">
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

        {!compact ? <Separator /> : null}

        <div className="grid min-h-0 gap-3 md:grid-cols-[1fr_210px]">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium">Accion recomendada</p>
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {selectedResidue.preparation}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Leaf01Icon} size={16} />
            <p className="text-xs font-medium">Impacto inmediato</p>
            </div>
            <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
              {selectedResidue.impact}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button
            size={compact ? "default" : "lg"}
            variant="outline"
            onClick={onAnalyze}
            disabled={phase === "analyzing"}
            className="flex-1"
          >
            <HugeiconsIcon icon={AiScanIcon} data-icon="inline-start" />
            Reanalizar
          </Button>
          <Button
            size={compact ? "default" : "lg"}
            onClick={onRecord}
            disabled={phase === "analyzing"}
            data-testid="record-action"
            className="flex-1"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
            Registrar
          </Button>
        </div>
      </div>
    </section>
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
    <section className="flex h-full min-h-0 flex-col gap-3">
      <PanelHeader
        title="Habito"
        description="Progreso visible."
        action={<Badge variant="outline">{points} pts</Badge>}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <Tabs defaultValue="today" className="min-h-0">
          <TabsList className="w-full">
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="impact">Impacto</TabsTrigger>
            <TabsTrigger value="flow">Flujo</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="flex min-h-0 flex-col gap-3 overflow-hidden pt-1">
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
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {isLogged
                  ? selectedResidue.habit
                  : "Registra la accion para sumar progreso."}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="impact" className="flex min-h-0 flex-col gap-2 overflow-hidden pt-1">
            <ImpactRow label="Residuos recuperados" value={isLogged ? "9" : "8"} />
            <ImpactRow label="CO2e estimado" value={isLogged ? "146 g" : "128 g"} />
            <ImpactRow label="Errores evitados" value="3" />
            <div className={cn("rounded-md border border-border bg-muted/20 p-3", compact && "hidden")}>
              <p className="text-xs leading-5 text-muted-foreground">
                Cada clasificacion correcta alimenta recomendaciones mas precisas para el hogar.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="flow" className="flex min-h-0 flex-col gap-2 overflow-hidden pt-1">
            <FlowStep index="01" title="Descubrir" description="Foto o residuo seleccionado." />
            <FlowStep index="02" title="Entender" description="FAYE identifica y explica." />
            <FlowStep index="03" title="Actuar" description="El usuario sigue el paso." />
            <FlowStep index="04" title="Repetir" description="La accion cuenta como habito." />
          </TabsContent>
        </Tabs>

        {!compact ? <Separator /> : null}

        {!compact ? (
          <div className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
              <HugeiconsIcon icon={ChartUpIcon} size={18} />
            </div>
            <div>
              <p className="text-xs font-medium">Ciclo completo</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Duda resuelta, accion registrada e impacto visible.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function FlowAside() {
  return (
    <aside className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <PanelHeader
        title="Flujo"
        description="De duda a habito."
      />
      <div className="flex min-h-0 flex-col gap-2">
        <FlowStep index="01" title="Entrada" description="Imagen o demo." />
        <FlowStep index="02" title="Clasificar" description="Categoria y destino." />
        <FlowStep index="03" title="Actuar" description="Paso claro." />
        <FlowStep index="04" title="Repetir" description="Progreso visible." />
      </div>
    </aside>
  )
}

function ResultSummary({ selectedResidue }: { selectedResidue: DemoResidue }) {
  return (
    <section className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <PanelHeader
        title="Ultimo registro"
        description="Residuo, destino y siguiente accion."
      />
      <div className="flex flex-col gap-3">
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
    <div className="flex min-h-20 flex-col justify-between rounded-md border border-border bg-muted/20 p-3">
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
    <div className="rounded-md border border-border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
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
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 p-2">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-card text-[0.625rem] font-medium tabular-nums">
        {index}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
