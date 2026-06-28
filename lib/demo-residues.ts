export type DemoResidue = {
  id: "pet-bottle" | "paper-receipt" | "organic-scraps"
  name: string
  shortName: string
  material: string
  category: string
  bin: string
  confidence: number
  preparation: string
  rationale: string
  habit: string
  impact: string
  reward: string
  points: number
  visual: {
    label: string
    detail: string
  }
}

export const demoResidues: DemoResidue[] = [
  {
    id: "pet-bottle",
    name: "Botella PET transparente",
    shortName: "Botella PET",
    material: "Plastico reciclable",
    category: "Envases plasticos",
    bin: "Contenedor amarillo",
    confidence: 96,
    preparation:
      "Vacia la botella, aplastala y coloca la tapa por separado si tu punto de acopio lo pide.",
    rationale:
      "FAYE detecta una silueta de botella, brillo plastico y etiqueta parcial. El material probable es PET, ideal para recuperacion si llega limpio.",
    habit: "Accion domestica registrada como clasificacion correcta.",
    impact: "1 envase recuperado y 18 g de CO2e evitados en la estimacion demo.",
    reward: "+12 puntos de habito",
    points: 12,
    visual: {
      label: "PET",
      detail: "750 ml",
    },
  },
  {
    id: "paper-receipt",
    name: "Ticket de compra",
    shortName: "Ticket",
    material: "Papel termico",
    category: "Residuo no reciclable",
    bin: "Contenedor general",
    confidence: 88,
    preparation:
      "No lo mezcles con papel reciclable. Si contiene datos personales, rompelo antes de desecharlo.",
    rationale:
      "FAYE reconoce el formato angosto y la textura de papel termico, que suele tener recubrimientos que complican el reciclaje.",
    habit: "Accion registrada como separacion preventiva.",
    impact: "Evita contaminar el flujo de papel reciclable de la casa.",
    reward: "+8 puntos de criterio",
    points: 8,
    visual: {
      label: "PAPEL",
      detail: "Termico",
    },
  },
  {
    id: "organic-scraps",
    name: "Restos de fruta",
    shortName: "Organico",
    material: "Residuo organico",
    category: "Compostable",
    bin: "Compost o contenedor organico",
    confidence: 92,
    preparation:
      "Separalo de bolsas, etiquetas y plasticos antes de llevarlo al compost o al contenedor organico.",
    rationale:
      "FAYE identifica textura irregular y origen alimentario. El residuo puede convertirse en compost si no esta mezclado.",
    habit: "Accion registrada como separacion organica.",
    impact: "Reduce residuos enviados a relleno y apoya compostaje domestico.",
    reward: "+10 puntos de impacto",
    points: 10,
    visual: {
      label: "ORG",
      detail: "Compost",
    },
  },
]
