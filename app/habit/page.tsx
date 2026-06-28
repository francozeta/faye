import { FayeFlow } from "@/components/faye-flow"

type HabitPageProps = {
  searchParams: Promise<{
    item?: string | string[]
  }>
}

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value ?? null
}

export default async function HabitPage({ searchParams }: HabitPageProps) {
  const params = await searchParams
  const item = firstParam(params.item)

  return (
    <FayeFlow
      key={`habit:${item ?? "default"}`}
      view="habit"
      initialResidueId={item}
    />
  )
}
