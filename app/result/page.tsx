import { FayeFlow } from "@/components/faye-flow"

type ResultPageProps = {
  searchParams: Promise<{
    item?: string | string[]
    source?: string | string[]
  }>
}

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value ?? null
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams
  const item = firstParam(params.item)
  const source = firstParam(params.source)

  return (
    <FayeFlow
      key={`result:${item ?? "default"}:${source ?? "demo"}`}
      view="result"
      initialResidueId={item}
      source={source}
    />
  )
}
