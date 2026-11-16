import { formatCurrency } from '@l2beat/shared-pure'
import { type ReactNode, useMemo } from 'react'
import { cn } from '~/utils/cn'
import { ChartContext, type ChartMeta } from './ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from './ChartTooltip'
import { placeBeside, useChartTooltip } from './useChartTooltip'

/** A slice; its label and color come from the chart meta. */
export interface DonutChartEntry {
  name: string
  value: number
}

/**
 * A donut whose first slice starts at 3 o'clock and the slices go
 * counter-clockwise, in data order. Hovering a slice shows the tooltip next
 * to the slice's middle (left of it on the right half), or at
 * `tooltipPosition`, relative to the chart's top-left corner.
 */
export function DonutChart({
  meta,
  data,
  innerRadius,
  outerRadius,
  centerLabel,
  className,
  tooltipPosition,
  tooltipClassName,
  formatValue = formatUsd,
  ariaLabel,
}: {
  meta: ChartMeta
  ariaLabel: string
  data: DonutChartEntry[]
  innerRadius: number
  outerRadius: number
  centerLabel?: DonutCenterLabel
  /** Sizes the chart; the donut is centred in it. */
  className?: string
  tooltipPosition?: { x: number; y: number }
  tooltipClassName?: string
  /** US dollars by default. */
  formatValue?: (value: number) => string
}) {
  const slices = useMemo(() => layoutSlices(data), [data])

  /** A slice's middle, in the chart's pixels. */
  function anchorOf(index: number) {
    const root = tooltip.rootRef.current
    const slice = slices[index]
    if (!root || !slice) return { x: 0, y: 0 }
    const [dx, dy] = polar(
      (innerRadius + outerRadius) / 2,
      (slice.start + slice.end) / 2,
    )
    return { x: root.offsetWidth / 2 + dx, y: root.offsetHeight / 2 + dy }
  }

  const tooltip = useChartTooltip({
    count: slices.length,
    anchorOf,
    place: (anchor, size) =>
      tooltipPosition ??
      placeBeside({ x: 0, width: tooltip.rootRef.current?.offsetWidth ?? 0 })(
        anchor,
        size,
      ),
    wrap: true,
  })
  const active = tooltip.active ? slices[tooltip.active.index] : undefined

  return (
    <ChartContext.Provider value={{ meta }}>
      <div
        ref={tooltip.rootRef}
        {...tooltip.interactiveProps}
        aria-label={ariaLabel}
        className={cn('relative select-none text-xs outline-none', className)}
      >
        <svg className="absolute inset-0 size-full" aria-hidden>
          {/* moving from a slice into the hole hides its tooltip */}
          <svg
            x="50%"
            y="50%"
            overflow="visible"
            onPointerLeave={tooltip.interactiveProps.onPointerLeave}
          >
            {slices.map((slice, i) => (
              <path
                key={slice.entry.name}
                d={slicePath(slice, innerRadius, outerRadius)}
                fill={meta[slice.entry.name]?.color}
                onPointerEnter={() => tooltip.select(i, anchorOf(i))}
                onPointerDown={() => tooltip.select(i, anchorOf(i))}
              />
            ))}
          </svg>
          {centerLabel && <DonutCenter {...centerLabel} />}
        </svg>
        <div {...tooltip.tooltipProps}>
          {active && (
            <DonutTooltip
              entry={active.entry}
              format={formatValue}
              className={tooltipClassName}
            />
          )}
        </div>
      </div>
    </ChartContext.Provider>
  )
}

function DonutTooltip({
  entry,
  format,
  className,
}: {
  entry: DonutChartEntry
  format: (value: number) => string
  className?: string
}) {
  return (
    <ChartTooltipWrapper>
      <div className={cn('flex flex-col gap-1', className)}>
        <ChartTooltipRow name={entry.name} gap="gap-x-3" wrapLabel={false}>
          <ChartTooltipValue value={entry.value} format={format} />
        </ChartTooltipRow>
      </div>
    </ChartTooltipWrapper>
  )
}

/** Lines of small text in the hole, or one label over a large value. */
type DonutCenterLabel =
  | { lines: string[]; value?: never; compact?: never }
  | { lines: [string]; value: ReactNode; compact?: boolean }

function DonutCenter({ lines, value, compact }: DonutCenterLabel) {
  const labelClassName = 'fill-secondary font-medium text-2xs leading-none'
  if (value !== undefined) {
    return (
      <text x="50%" y="50%" textAnchor="middle">
        <tspan
          x="50%"
          y="50%"
          className={labelClassName}
          dy={compact ? -9 : -16}
        >
          {lines[0]}
        </tspan>
        <tspan
          x="50%"
          y="50%"
          className={cn(
            'fill-primary font-semibold text-2xl leading-none',
            compact && 'text-lg',
          )}
          dy={9}
        >
          {value}
        </tspan>
      </text>
    )
  }
  // Lines 12px apart, the block centred on the hole.
  return (
    <text x="50%" y="50%" textAnchor="middle">
      {lines.map((line, i) => (
        <tspan
          key={line}
          x="50%"
          dy={i === 0 ? 5 - (lines.length - 1) * 6 : 12}
          className={labelClassName}
        >
          {line}
        </tspan>
      ))}
    </text>
  )
}

// Drawn by hand: d3-shape's pie and arc would load it on the donut-only
// pages too, as a chunk every time-series page then loads on its own
// (e2e/nav-perf).
interface Slice {
  entry: DonutChartEntry
  /** Radians clockwise from 3 o'clock, as on screen. */
  start: number
  end: number
}

/**
 * From 3 o'clock, counter-clockwise, in data order. Empty slices are left
 * out, so the arrow keys cannot land on one the pointer could never hover.
 */
function layoutSlices(data: DonutChartEntry[]): Slice[] {
  const total = data.reduce((sum, entry) => sum + Math.max(entry.value, 0), 0)
  if (total === 0) return []
  const slices: Slice[] = []
  let angle = 0
  for (const entry of data) {
    if (entry.value <= 0) continue
    const end = angle - (2 * Math.PI * entry.value) / total
    slices.push({ entry, start: angle, end })
    angle = end
  }
  return slices
}

function slicePath(slice: Slice, inner: number, outer: number) {
  const span = slice.start - slice.end
  if (span > 2 * Math.PI - 1e-6) {
    // An arc cannot end where it starts, so a whole ring is two halves, with
    // the hole drawn the other way round to cut it out.
    const ring = (r: number, sweep: number) =>
      `M${r},0A${r},${r},0,1,${sweep},${-r},0A${r},${r},0,1,${sweep},${r},0`
    return `${ring(outer, 0)}${inner > 0 ? ring(inner, 1) : ''}Z`
  }
  const large = span > Math.PI ? 1 : 0
  // Thousandths of a pixel keep the path short.
  const at = (radius: number, angle: number) =>
    polar(radius, angle)
      .map((v) => Math.round(v * 1000) / 1000)
      .join(',')
  return [
    `M${at(outer, slice.start)}`,
    `A${outer},${outer},0,${large},0,${at(outer, slice.end)}`,
    `L${at(inner, slice.end)}`,
    `A${inner},${inner},0,${large},1,${at(inner, slice.start)}`,
    'Z',
  ].join('')
}

function polar(radius: number, angle: number): [number, number] {
  return [radius * Math.cos(angle), radius * Math.sin(angle)]
}

function formatUsd(value: number) {
  return formatCurrency(value, 'usd')
}
