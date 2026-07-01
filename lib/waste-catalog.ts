export const wasteResidueTypeIds = [
  "pet-bottle",
  "aluminum-can",
  "cardboard-box",
  "glass-bottle",
  "organic-scraps",
  "paper-receipt",
  "beverage-carton",
  "dirty-plastic-wrapper",
  "used-battery",
  "uncertain-household-waste",
] as const

export const wasteDestinations = [
  "recycling",
  "compost",
  "general",
  "special",
  "uncertain",
] as const

export const wasteRuleScopes = ["national", "district", "uncertain"] as const

export type WasteResidueTypeId = (typeof wasteResidueTypeIds)[number]
export type WasteDestination = (typeof wasteDestinations)[number]
export type WasteRuleScope = (typeof wasteRuleScopes)[number]

export type WasteGuidance = {
  name: string
  shortName: string
  material: string
  category: string
  bin: string
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

export type WasteResidueType = WasteGuidance & {
  id: WasteResidueTypeId
  aliases: readonly string[]
  confidence: number
  destination: WasteDestination
  ruleScope: WasteRuleScope
}

export type WasteDecision = WasteGuidance & {
  id: string
  confidence: number
  destination: WasteDestination
  normalized: boolean
  residueTypeId: WasteResidueTypeId
  ruleScope: WasteRuleScope
}

type WasteDecisionInput = Partial<WasteGuidance> & {
  confidence?: number
  id?: string
  residueTypeId?: string
}

const uncertainWasteResidueTypeId = "uncertain-household-waste"

export const wasteResidueTypes = [
  {
    id: "pet-bottle",
    name: "Botella PET transparente",
    shortName: "Botella PET",
    material: "Plastico reciclable",
    category: "Envases plasticos",
    bin: "Contenedor amarillo",
    confidence: 96,
    destination: "recycling",
    ruleScope: "national",
    aliases: [
      "botella pet",
      "pet",
      "botella plastica",
      "envase plastico transparente",
    ],
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
    id: "aluminum-can",
    name: "Lata de aluminio",
    shortName: "Lata",
    material: "Metal reciclable",
    category: "Envases metalicos",
    bin: "Contenedor amarillo",
    confidence: 94,
    destination: "recycling",
    ruleScope: "national",
    aliases: ["lata", "lata de aluminio", "aluminio", "envase metalico"],
    preparation:
      "Vacia la lata, enjuagala si tiene restos pegajosos y aplastala solo si tu punto de acopio lo acepta.",
    rationale:
      "El aluminio conserva valor de recuperacion cuando llega limpio y separado de residuos organicos.",
    habit: "Accion registrada como recuperacion de metal domestico.",
    impact: "1 lata recuperada y menor demanda de aluminio primario en la estimacion demo.",
    reward: "+12 puntos de reciclaje",
    points: 12,
    visual: {
      label: "MET",
      detail: "Lata",
    },
  },
  {
    id: "cardboard-box",
    name: "Caja de carton",
    shortName: "Carton",
    material: "Carton reciclable",
    category: "Papel y carton",
    bin: "Contenedor azul o punto de acopio",
    confidence: 92,
    destination: "recycling",
    ruleScope: "district",
    aliases: ["caja de carton", "carton corrugado", "empaque de carton"],
    preparation:
      "Retira cintas y restos de comida, aplana la caja y mantenla seca para no contaminar el papel reciclable.",
    rationale:
      "El carton limpio y seco puede integrarse al flujo de papel recuperado; si esta grasoso debe separarse.",
    habit: "Accion registrada como separacion de carton limpio.",
    impact: "Aumenta la recuperacion de fibra y reduce volumen en la bolsa comun.",
    reward: "+10 puntos de orden",
    points: 10,
    visual: {
      label: "CAR",
      detail: "Seco",
    },
  },
  {
    id: "glass-bottle",
    name: "Botella de vidrio",
    shortName: "Vidrio",
    material: "Vidrio reciclable",
    category: "Envases de vidrio",
    bin: "Punto de acopio para vidrio",
    confidence: 93,
    destination: "recycling",
    ruleScope: "district",
    aliases: ["botella de vidrio", "frasco de vidrio", "vidrio", "envase de vidrio"],
    preparation:
      "Vacia el envase, enjuagalo si es necesario y evita mezclarlo con ceramica, espejos o focos.",
    rationale:
      "Los envases de vidrio son recuperables cuando llegan separados de materiales que funden distinto.",
    habit: "Accion registrada como separacion segura de vidrio.",
    impact: "1 envase de vidrio listo para acopio especializado.",
    reward: "+11 puntos de cuidado",
    points: 11,
    visual: {
      label: "VID",
      detail: "Envase",
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
    destination: "compost",
    ruleScope: "district",
    aliases: ["restos de fruta", "cascara", "organico", "compost", "residuo organico"],
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
  {
    id: "paper-receipt",
    name: "Ticket de compra",
    shortName: "Ticket",
    material: "Papel termico",
    category: "Residuo no reciclable",
    bin: "Contenedor general",
    confidence: 88,
    destination: "general",
    ruleScope: "national",
    aliases: ["ticket", "boleta", "recibo", "papel termico", "voucher"],
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
    id: "beverage-carton",
    name: "Envase multicapa",
    shortName: "Tetra Pak",
    material: "Carton plastificado",
    category: "Envase multicapa",
    bin: "Punto de acopio especializado",
    confidence: 86,
    destination: "special",
    ruleScope: "district",
    aliases: ["tetra pak", "envase multicapa", "carton de leche", "carton de jugo"],
    preparation:
      "Vacialo, enjuagalo, escurre el liquido y aplastalo antes de llevarlo a un punto que acepte multicapa.",
    rationale:
      "El envase combina carton, plastico y aluminio; necesita una cadena de recuperacion especifica.",
    habit: "Accion registrada como separacion de envase multicapa.",
    impact: "Evita que un material recuperable termine mezclado con residuos generales.",
    reward: "+13 puntos de precision",
    points: 13,
    visual: {
      label: "MIX",
      detail: "Multicapa",
    },
  },
  {
    id: "dirty-plastic-wrapper",
    name: "Empaque plastico sucio",
    shortName: "Empaque",
    material: "Plastico flexible contaminado",
    category: "Residuo no reciclable",
    bin: "Contenedor general",
    confidence: 82,
    destination: "general",
    ruleScope: "national",
    aliases: [
      "envoltura",
      "empaque sucio",
      "bolsa sucia",
      "plastico flexible sucio",
      "snack",
    ],
    preparation:
      "Si esta grasoso o con restos de comida, no lo mezcles con reciclables limpios; reduce volumen antes de botarlo.",
    rationale:
      "La contaminacion por grasa o comida reduce la posibilidad de recuperacion del plastico flexible.",
    habit: "Accion registrada como descarte responsable para no contaminar reciclables.",
    impact: "Protege el flujo de reciclaje limpio de la casa.",
    reward: "+7 puntos de criterio",
    points: 7,
    visual: {
      label: "GEN",
      detail: "Sucio",
    },
  },
  {
    id: "used-battery",
    name: "Pila usada",
    shortName: "Pila",
    material: "Residuo peligroso domiciliario",
    category: "Manejo especial",
    bin: "Punto de acopio RAEE o pilas",
    confidence: 90,
    destination: "special",
    ruleScope: "district",
    aliases: ["pila", "bateria usada", "bateria", "aa", "aaa"],
    preparation:
      "Guardala seca y separada; no la abras ni la mezcles con basura comun. Llevala a un punto de acopio autorizado.",
    rationale:
      "Las pilas pueden contener metales y componentes que requieren manejo especial para evitar contaminacion.",
    habit: "Accion registrada como separacion de residuo de manejo especial.",
    impact: "Reduce riesgo de contaminacion por metales en residuos domesticos.",
    reward: "+15 puntos de seguridad",
    points: 15,
    visual: {
      label: "RAEE",
      detail: "Pila",
    },
  },
  {
    id: "uncertain-household-waste",
    name: "Residuo por confirmar",
    shortName: "Por confirmar",
    material: "Material no confirmado",
    category: "Clasificacion incierta",
    bin: "Separar y verificar informacion local",
    confidence: 45,
    destination: "uncertain",
    ruleScope: "uncertain",
    aliases: [],
    preparation:
      "Toma otra foto con el residuo centrado, buena luz y sin objetos que confundan la decision.",
    rationale:
      "FAYE no encontro suficiente evidencia para encajar el residuo en una categoria domestica normalizada.",
    habit: "Accion pendiente hasta confirmar el material.",
    impact: "Evita una recomendacion falsa y mantiene limpia la decision de reciclaje.",
    reward: "+0 puntos hasta confirmar",
    points: 0,
    visual: {
      label: "INC",
      detail: "Revisar",
    },
  },
] satisfies WasteResidueType[]

export function getWasteResidueTypeById(id?: string | null) {
  return wasteResidueTypes.find((residue) => residue.id === id) ?? null
}

export function getUncertainWasteDecision() {
  return toWasteDecision(requireWasteResidueType(uncertainWasteResidueTypeId), 45, false)
}

export function toWasteDecision(
  residue: WasteResidueType,
  confidence = residue.confidence,
  normalized = true
): WasteDecision {
  return {
    id: residue.id,
    name: residue.name,
    shortName: residue.shortName,
    material: residue.material,
    category: residue.category,
    bin: residue.bin,
    confidence: clampInteger(confidence, 0, 100),
    destination: residue.destination,
    normalized,
    preparation: residue.preparation,
    rationale: residue.rationale,
    habit: residue.habit,
    impact: residue.impact,
    reward: residue.reward,
    points: residue.points,
    residueTypeId: residue.id,
    ruleScope: residue.ruleScope,
    visual: residue.visual,
  }
}

export function normalizeWasteDecision(
  input: WasteDecisionInput,
  seed?: WasteDecision | null
): WasteDecision {
  const matchedResidue = matchWasteResidueType(input, seed)

  if (matchedResidue) {
    return toWasteDecision(
      matchedResidue,
      input.confidence ?? matchedResidue.confidence
    )
  }

  const uncertainResidue = requireWasteResidueType(uncertainWasteResidueTypeId)
  const uncertainDecision = toWasteDecision(
    uncertainResidue,
    Math.min(input.confidence ?? uncertainResidue.confidence, 55),
    false
  )

  return {
    ...uncertainDecision,
    name: cleanCatalogText(input.name, uncertainDecision.name, 80),
    material: cleanCatalogText(input.material, uncertainDecision.material, 48),
    rationale: cleanCatalogText(
      input.rationale,
      uncertainDecision.rationale,
      240
    ),
  }
}

export function buildWasteCatalogPromptSummary() {
  return wasteResidueTypes
    .filter((residue) => residue.id !== uncertainWasteResidueTypeId)
    .map(
      (residue) =>
        `${residue.id}: ${residue.name}; aliases: ${residue.aliases.join(", ")}; categoria: ${residue.category}; destino: ${residue.bin}`
    )
    .join("\n")
}

function matchWasteResidueType(
  input: WasteDecisionInput,
  seed?: WasteDecision | null
) {
  const seedResidue = seed?.residueTypeId
    ? getWasteResidueTypeById(seed.residueTypeId)
    : null

  if (seedResidue && seedResidue.id !== uncertainWasteResidueTypeId) {
    return seedResidue
  }

  const explicitResidue =
    getWasteResidueTypeById(input.residueTypeId) ??
    getWasteResidueTypeById(input.id)

  if (explicitResidue && explicitResidue.id !== uncertainWasteResidueTypeId) {
    return explicitResidue
  }

  const normalizedContext = normalizeSearchText(
    [
      input.id,
      input.name,
      input.shortName,
      input.material,
      input.category,
      input.bin,
    ]
      .filter(Boolean)
      .join(" ")
  )

  if (!normalizedContext) {
    return null
  }

  return (
    wasteResidueTypes.find((residue) => {
      if (residue.id === uncertainWasteResidueTypeId) {
        return false
      }

      const residueId = normalizeSearchText(residue.id)

      return (
        normalizedContext.includes(residueId) ||
        residue.aliases.some((alias) =>
          normalizedContext.includes(normalizeSearchText(alias))
        )
      )
    }) ?? null
  )
}

function requireWasteResidueType(id: WasteResidueTypeId) {
  const residue = getWasteResidueTypeById(id)

  if (!residue) {
    throw new Error(`Missing waste residue type: ${id}`)
  }

  return residue
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function cleanCatalogText(
  value: string | undefined,
  fallback: string,
  maxLength: number
) {
  const text = value?.trim() || fallback

  return text.length > maxLength ? text.slice(0, maxLength).trim() : text
}

function clampInteger(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min
  }

  return Math.min(max, Math.max(min, Math.round(value)))
}
