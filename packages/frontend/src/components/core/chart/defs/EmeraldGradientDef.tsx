export function EmeraldFillGradientDef({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="0%"
        stopColor="hsl(var(--chart-emerald-fill-gradient))"
        stopOpacity={1}
      />
      <stop
        offset="50%"
        stopColor="hsl(var(--chart-emerald-fill-gradient))"
        stopOpacity={0.4}
      />
      <stop
        offset="100%"
        stopColor="hsl(var(--chart-emerald-fill-gradient))"
        stopOpacity={0}
      />
    </linearGradient>
  )
}
