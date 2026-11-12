import { memo } from 'react'
import { cn } from '~/utils/cn'

/**
 * The last N values beside a number, so one reading comes with its trend.
 * Drawn at its pixel size, so the end dot stays round; `reference` is a
 * target the series is read against (gas target, blob target)
 */
export const Sparkline = memo(function Sparkline({
  values,
  width = 64,
  height = 22,
  reference,
  floor,
  color = 'var(--chart-ethereum)',
  partialLast = false,
  className,
  label,
}: {
  values: number[]
  width?: number
  height?: number
  reference?: number
  /** Pins the bottom of the scale, so a flat series near zero is not blown up into noise */
  floor?: number
  color?: string
  /** The last value is a day still in progress: drawn dashed, ending in a hollow dot */
  partialLast?: boolean
  className?: string
  label: string
}) {
  if (values.length < 2) {
    return (
      <svg
        width={width}
        height={height}
        className={cn('shrink-0', className)}
        aria-hidden
      >
        <line
          x1={0}
          x2={width}
          y1={height - 1.5}
          y2={height - 1.5}
          className="stroke-divider"
          strokeDasharray="2 3"
        />
      </svg>
    )
  }
  const all = reference === undefined ? values : [...values, reference]
  const min = floor ?? Math.min(...all)
  const max = Math.max(...all)
  const span = max - min || 1
  const pad = 2.5
  const x = (i: number) => (i / (values.length - 1)) * (width - pad * 2) + pad
  const y = (v: number) =>
    height - pad - ((v - min) / span) * (height - pad * 2)
  const points = values.map((v, i) => `${x(i)},${y(v)}`)
  const solid = partialLast ? points.slice(0, -1) : points
  const lastIndex = values.length - 1
  const last = values[lastIndex] ?? 0
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className={cn('shrink-0 overflow-visible', className)}
    >
      {reference !== undefined && (
        <line
          x1={pad}
          x2={width - pad}
          y1={y(reference)}
          y2={y(reference)}
          stroke="var(--secondary)"
          strokeOpacity={0.55}
          strokeDasharray="2 2"
          strokeWidth={1}
        />
      )}
      <polyline
        points={solid.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {partialLast && (
        <polyline
          points={points.slice(-2).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={1.25}
          strokeDasharray="2 2"
        />
      )}
      <circle
        cx={x(lastIndex)}
        cy={y(last)}
        r={2}
        fill={partialLast ? 'var(--surface-primary)' : color}
        stroke={color}
        strokeWidth={1.25}
      />
    </svg>
  )
})
