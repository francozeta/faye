"use client"

import * as React from "react"
import {
  AiScanIcon,
  CameraAiIcon,
  ChartUpIcon,
  CheckmarkCircle02Icon,
  ImageUploadIcon,
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

type Phase = "ready" | "analyzing" | "logged"

const scenarioIcons = {
  "pet-bottle": Recycle01Icon,
  "paper-receipt": WasteIcon,
  "organic-scraps": Leaf01Icon,
} satisfies Record<DemoResidue["id"], typeof Recycle01Icon>

export function FayeDemo() {
  const [selectedId, setSelectedId] =
    React.useState<DemoResidue["id"]>("pet-bottle")
  const [phase, setPhase] = React.useState<Phase>("ready")
  const [loggedCount, setLoggedCount] = React.useState(8)

  const selectedResidue =
    demoResidues.find((residue) => residue.id === selectedId) ?? demoResidues[0]
  const progress = phase === "logged" ? 76 : 64
  const streak = phase === "logged" ? 4 : 3
  const points = 146 + (phase === "logged" ? selectedResidue.points : 0)

  function selectResidue(nextValue: DemoResidue["id"]) {
    setSelectedId(nextValue)
    setPhase("ready")
  }

  function analyzeResidue() {
    setPhase("analyzing")
    window.setTimeout(() => {
      setPhase("ready")
    }, 900)
  }

  function recordAction() {
    if (phase === "logged") {
      return
    }

    setPhase("logged")
    setLoggedCount((current) => current + 1)
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
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
                  Eve convierte dudas de reciclaje en acciones registradas.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Eve lista</Badge>
              <Badge variant="outline">Clasificacion</Badge>
              <Badge variant="outline">Habitos</Badge>
              <Badge variant="outline">Impacto</Badge>
            </div>
          </header>

          <section className="grid flex-1 gap-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
            <Card className="min-h-[560px]">
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
                <CardDescription>Residuo domestico actual.</CardDescription>
                <CardAction>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button size="icon" variant="ghost" aria-label="Captura demo">
                          <HugeiconsIcon icon={CameraAiIcon} />
                        </Button>
                      }
                    />
                    <TooltipContent>Captura demo</TooltipContent>
                  </Tooltip>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex aspect-[4/5] min-h-72 flex-col justify-between rounded-md border border-border bg-muted/20 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">Captura</Badge>
                    <Badge variant="secondary">{selectedResidue.material}</Badge>
                  </div>

                  <div className="flex flex-1 items-center justify-center py-8">
                    <div className="grid size-40 place-items-center rounded-md border border-border bg-card">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="grid size-14 place-items-center rounded-md bg-muted">
                          <HugeiconsIcon
                            icon={scenarioIcons[selectedResidue.id]}
                            size={28}
                          />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">
                            {selectedResidue.visual.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedResidue.visual.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>{selectedResidue.shortName}</span>
                    <span>{selectedResidue.confidence}% match</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium">Fuente de entrada</p>
                  <ToggleGroup
                    multiple={false}
                    value={[selectedId]}
                    onValueChange={(value) => {
                      const nextValue = value.at(-1)

                      if (
                        nextValue &&
                        demoResidues.some((residue) => residue.id === nextValue)
                      ) {
                        selectResidue(nextValue as DemoResidue["id"])
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
                        <HugeiconsIcon
                          icon={scenarioIcons[residue.id]}
                          data-icon="inline-start"
                        />
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

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={analyzeResidue}>
                    <HugeiconsIcon icon={CameraAiIcon} data-icon="inline-start" />
                    Camara
                  </Button>
                  <Button variant="outline" onClick={analyzeResidue}>
                    <HugeiconsIcon icon={ImageUploadIcon} data-icon="inline-start" />
                    Subir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-[560px]">
              <CardHeader>
                <CardTitle>Eve en accion</CardTitle>
                <CardDescription>
                  Clasificacion, explicacion y siguiente paso.
                </CardDescription>
                <CardAction>
                  <Badge variant={phase === "analyzing" ? "secondary" : "default"}>
                    {phase === "analyzing" ? "Analizando" : "Lista"}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4">
                <div
                  className="flex min-h-32 flex-col justify-between rounded-md border border-border bg-muted/20 p-4"
                  aria-live="polite"
                >
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
                            ? "Eve esta revisando forma, material y contexto."
                            : `Parece ser: ${selectedResidue.name}`}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {phase === "analyzing"
                            ? "Estoy comparando senales visuales para darte una accion segura."
                            : selectedResidue.rationale}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-semibold tabular-nums">
                        {phase === "analyzing"
                          ? "..."
                          : `${selectedResidue.confidence}%`}
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
                  <DecisionMetric
                    label="Destino"
                    value={selectedResidue.bin}
                    icon={WasteIcon}
                  />
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
                    onClick={analyzeResidue}
                    disabled={phase === "analyzing"}
                    data-testid="analyze-with-eve"
                    className="flex-1"
                  >
                    <HugeiconsIcon icon={AiScanIcon} data-icon="inline-start" />
                    Analizar con Eve
                  </Button>
                  <Button
                    size="lg"
                    variant={phase === "logged" ? "secondary" : "outline"}
                    onClick={recordAction}
                    disabled={phase === "analyzing"}
                    data-testid="record-action"
                    className="flex-1"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      data-icon="inline-start"
                    />
                    {phase === "logged" ? "Accion registrada" : "Registrar accion"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-[560px]">
              <CardHeader>
                <CardTitle>Habito</CardTitle>
                <CardDescription>
                  Progreso visible para repetir la accion.
                </CardDescription>
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
                      <p className="text-xs font-medium">Respuesta de Eve</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {phase === "logged"
                          ? selectedResidue.habit
                          : "Cuando registres la accion, Eve la suma a tu habito y ajusta el progreso."}
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="impact" className="flex flex-col gap-3 pt-2">
                    <ImpactRow
                      label="Residuos recuperados"
                      value={phase === "logged" ? "9" : "8"}
                    />
                    <ImpactRow
                      label="CO2e estimado"
                      value={phase === "logged" ? "146 g" : "128 g"}
                    />
                    <ImpactRow label="Errores evitados" value="3" />
                    <div className="rounded-md border border-border bg-muted/20 p-3">
                      <p className="text-xs leading-5 text-muted-foreground">
                        Cada clasificacion correcta alimenta recomendaciones mas
                        precisas para el hogar.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="flow" className="flex flex-col gap-3 pt-2">
                    <FlowStep
                      index="01"
                      title="Descubrir"
                      description="Foto o residuo seleccionado."
                    />
                    <FlowStep
                      index="02"
                      title="Entender"
                      description="Eve identifica y explica."
                    />
                    <FlowStep
                      index="03"
                      title="Actuar"
                      description="El usuario sigue el paso."
                    />
                    <FlowStep
                      index="04"
                      title="Repetir"
                      description="La accion cuenta como habito."
                    />
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
                      Duda resuelta, accion registrada e impacto visible en una
                      sola experiencia.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </TooltipProvider>
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
