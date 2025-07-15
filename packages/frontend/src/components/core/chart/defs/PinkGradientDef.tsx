export function PinkFillGradientDef({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="25%"
        stopColor="var(--chart-pink-fill-gradient)"
        stopOpacity={0.8}
      />
      <stop
        offset="50%"
        stopColor="var(--chart-pink-fill-gradient)"
        stopOpacity={0.4}
      />
      <stop
        offset="100%"
        stopColor="var(--chart-pink-fill-gradient)"
        stopOpacity={0}
      />
    </linearGradient>
  )
}

export function PinkStrokeGradientDef({ id }: { id: string }) {
  return (
    <linearGradient
      id={id}
      x1="0"
      y1="0"
      x2="100%"
      y2="0"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor="var(--chart-pink-stroke-gradient-1)" />
      <stop offset="100%" stopColor="var(--chart-pink-stroke-gradient-2)" />
    </linearGradient>
  )
}
