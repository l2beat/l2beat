/** Fades down from `top` to a transparent `bottom`. */
export interface FillGradient {
  type: 'fill'
  top: string
  bottom: string
}

/**
 * Runs left to right along each line, or across the whole plot with
 * `acrossPlot`, so lines of different lengths share one gradient.
 */
export interface StrokeGradient {
  type: 'stroke'
  from: string
  to: string
  acrossPlot?: boolean
}

export function fillGradient(top: string, bottom = top): FillGradient {
  return { type: 'fill', top, bottom }
}

function strokeGradient(
  from: string,
  to: string,
  acrossPlot = false,
): StrokeGradient {
  return { type: 'stroke', from, to, acrossPlot }
}

export const CHART_GRADIENTS = {
  pink: {
    fill: fillGradient('var(--chart-pink-fill-gradient)'),
    stroke: strokeGradient(
      'var(--chart-pink-stroke-gradient-1)',
      'var(--chart-pink-stroke-gradient-2)',
      true,
    ),
  },
  cyan: {
    fill: fillGradient('var(--chart-cyan-fill-gradient)'),
    stroke: strokeGradient(
      'var(--chart-cyan-stroke-gradient-1)',
      'var(--chart-cyan-stroke-gradient-2)',
    ),
  },
  yellow: {
    fill: fillGradient('var(--chart-yellow-fill-gradient)'),
    stroke: strokeGradient(
      'var(--chart-yellow-stroke-gradient-1)',
      'var(--chart-yellow-stroke-gradient-2)',
    ),
  },
  ethereum: {
    fill: fillGradient('var(--chart-ethereum-fill-gradient)'),
    stroke: strokeGradient(
      'var(--chart-ethereum-stroke-gradient-1)',
      'var(--chart-ethereum-stroke-gradient-2)',
    ),
  },
  emerald: {
    fill: fillGradient('var(--chart-emerald-fill-gradient)'),
  },
} as const

export function GradientDef({
  id,
  gradient,
}: {
  id: string
  gradient: FillGradient | StrokeGradient
}) {
  if (gradient.type === 'fill') {
    return (
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="25%" stopColor={gradient.top} stopOpacity={0.8} />
        <stop offset="50%" stopColor={gradient.bottom} stopOpacity={0.4} />
        <stop offset="100%" stopColor={gradient.bottom} stopOpacity={0} />
      </linearGradient>
    )
  }
  return (
    <linearGradient
      id={id}
      x1="0"
      y1="0"
      {...(gradient.acrossPlot
        ? { x2: '100%', y2: '0', gradientUnits: 'userSpaceOnUse' }
        : { x2: '1', y2: '0' })}
    >
      <stop offset="0%" stopColor={gradient.from} />
      <stop offset="100%" stopColor={gradient.to} />
    </linearGradient>
  )
}
