export function FuchsiaFillGradientDef({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="25%"
        stopColor="hsl(var(--chart-fuchsia-fill-gradient))"
        stopOpacity={0.8}
      />
      <stop
        offset="50%"
        stopColor="hsl(var(--chart-fuchsia-fill-gradient))"
        stopOpacity={0.4}
      />
      <stop
        offset="100%"
        stopColor="hsl(var(--chart-fuchsia-fill-gradient))"
        stopOpacity={0}
      />
    </linearGradient>
  )
}
