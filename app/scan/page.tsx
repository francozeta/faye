import { FayeFlow } from "@/components/faye-flow"

type ScanPageProps = {
  searchParams: Promise<{
    item?: string | string[]
  }>
}

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value ?? null
}

export default async function ScanPage({ searchParams }: ScanPageProps) {
  const params = await searchParams
  const item = firstParam(params.item)

  return (
    <FayeFlow
      key={`scan:${item ?? "default"}`}
      view="scan"
      initialResidueId={item}
    />
  )
}
