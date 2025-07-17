export function LimeFillGradientDef({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="25%"
        stopColor="var(--chart-lime-fill-gradient)"
        stopOpacity={0.8}
      />
      <stop
        offset="50%"
        stopColor="var(--chart-lime-fill-gradient)"
        stopOpacity={0.4}
      />
      <stop
        offset="100%"
        stopColor="var(--chart-lime-fill-gradient)"
        stopOpacity={0}
      />
    </linearGradient>
  )
}
