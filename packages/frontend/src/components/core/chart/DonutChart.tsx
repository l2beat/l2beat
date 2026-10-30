import { assert, formatCurrency } from '@l2beat/shared-pure'
import { arc, type PieArcDatum, pie } from 'd3-shape'
import { type ReactNode, useMemo } from 'react'
import { cn } from '~/utils/cn'
import { ChartContext, type ChartMeta, useChart } from './ChartContext'
import { ChartDataIndicator } from './ChartDataIndicator'
import { ChartTooltipWrapper } from './ChartTooltip'
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
  const { arcs, path } = useMemo(() => {
    const total = data.reduce((acc, entry) => acc + entry.value, 0)
    // d3 measures clockwise from 12 o'clock; starting at 3 o'clock and going
    // counter-clockwise is d3's π/2..π/2-2π. Empty slices are left out, so
    // the arrow keys cannot land on one the pointer could never hover.
    const arcs =
      total > 0
        ? pie<DonutChartEntry>()
            .value((entry) => entry.value)
            .sort(null)
            .startAngle(Math.PI / 2)
            .endAngle(Math.PI / 2 - 2 * Math.PI)(data)
            .filter((slice) => slice.value > 0)
        : []
    const path = arc<PieArcDatum<DonutChartEntry>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
    return { arcs, path }
  }, [data, innerRadius, outerRadius])

  /** A slice's middle, in the chart's pixels. */
  function anchorOf(index: number) {
    const root = tooltip.rootRef.current
    const slice = arcs[index]
    if (!root || !slice) return { x: 0, y: 0 }
    const [dx, dy] = path.centroid(slice)
    return { x: root.offsetWidth / 2 + dx, y: root.offsetHeight / 2 + dy }
  }

  const tooltip = useChartTooltip({
    count: arcs.length,
    anchorOf,
    place: (anchor, size) =>
      tooltipPosition ??
      placeBeside({ x: 0, width: tooltip.rootRef.current?.offsetWidth ?? 0 })(
        anchor,
        size,
      ),
    wrap: true,
  })
  const active = tooltip.active ? arcs[tooltip.active.index] : undefined

  return (
    <ChartContext.Provider value={{ meta }}>
      <div
        ref={tooltip.rootRef}
        {...tooltip.interactiveProps}
        aria-label={ariaLabel}
        className={cn('relative select-none text-xs outline-none', className)}
      >
        <svg className="absolute inset-0 size-full" aria-hidden>
          <svg x="50%" y="50%" overflow="visible">
            {arcs.map((d, i) => (
              <path
                key={d.data.name}
                d={path(d) ?? undefined}
                fill={meta[d.data.name]?.color}
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
              entry={active.data}
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
  const config = useChart().meta[entry.name]
  assert(config, 'Chart meta is missing')
  return (
    <ChartTooltipWrapper>
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="flex items-center justify-between gap-x-3">
          <span className="flex items-center gap-1">
            <ChartDataIndicator
              backgroundColor={config.color}
              type={config.indicatorType}
            />
            <span className="whitespace-nowrap leading-none sm:w-fit">
              {config.label}
            </span>
          </span>
          <span className="whitespace-nowrap font-medium leading-none">
            {format(entry.value)}
          </span>
        </div>
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

function formatUsd(value: number) {
  return formatCurrency(value, 'usd')
}
