import { useChartDefId } from './chartDefId'

export function EmeraldFillGradientDef({ id }: { id: string }) {
  const scopedId = useChartDefId(id)
  return (
    <linearGradient id={scopedId} x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="25%"
        stopColor="var(--chart-emerald-fill-gradient)"
        stopOpacity={0.8}
      />
      <stop
        offset="50%"
        stopColor="var(--chart-emerald-fill-gradient)"
        stopOpacity={0.4}
      />
      <stop
        offset="100%"
        stopColor="var(--chart-emerald-fill-gradient)"
        stopOpacity={0}
      />
    </linearGradient>
  )
}
