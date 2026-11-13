import { UnixTime } from '@l2beat/shared-pure'
import { type ReactNode, useLayoutEffect, useRef } from 'react'
import { tooltipSurfaceClassName } from '~/components/core/tooltip/Tooltip'
import {
  type HomeSparklineSeries,
  WEEK_DAYS,
} from '~/server/features/home/homeSeries'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import type { SparklinePoint } from './sparklineScale'

/**
 * The date and the value under the cursor or finger, compact: the series is
 * named beside the chart. Placed off the chart by `PointTooltip`.
 */
export function SparklineTooltip({
  point,
  formatValue,
  series,
  anchorX,
  side,
}: {
  point: SparklinePoint
  formatValue: (value: number) => string
  /** What the point belongs to: its period and the names of its parts. */
  series: HomeSparklineSeries
  /** The active point's x, in the chart's pixels. */
  anchorX: number
  side: 'above' | 'below'
}) {
  const label = point.timestamp
  const format = (value: unknown) =>
    typeof value === 'number' ? formatValue(value) : 'No data'
  return (
    <PointTooltip anchorX={anchorX} side={side}>
      <div className="whitespace-nowrap text-label-value-13 text-secondary">
        {formatRange(label, label + WEEK_DAYS * UnixTime.DAY)}
      </div>
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="font-semibold text-label-value-15 tabular-nums">
          {format(point.value)}
        </span>
        <span className="text-label-value-13 text-secondary">
          daily average
        </span>
      </div>
      {series.partLabels?.map((partLabel, index) => (
        <div
          key={partLabel}
          className="flex justify-between gap-3 whitespace-nowrap text-label-value-13"
        >
          <span className="text-secondary">{partLabel}</span>
          <span className="font-medium tabular-nums">
            {format(point.parts[index])}
          </span>
        </div>
      ))}
    </PointTooltip>
  )
}

/**
 * A tooltip clear of the whole chart, labels and all, so it never hides the
 * line it describes: on its `side` of the chart, or the other one where the
 * window has no room. It centres on the active point, within the chart's
 * width where it fits, so it spills less onto the charts beside, and always
 * inside the window. After every render it moves into place, before the frame
 * is painted.
 */
function PointTooltip({
  anchorX,
  side,
  children,
}: {
  anchorX: number
  side: 'above' | 'below'
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const box = ref.current
    const chart = box?.offsetParent
    if (!box || !chart) return
    const rect = chart.getBoundingClientRect()
    const { offsetWidth: width, offsetHeight: height } = box
    const { clientWidth, clientHeight } = document.documentElement
    // In the chart's pixels.
    const centred = anchorX - width / 2
    const inChart =
      width <= chart.clientWidth
        ? clamp(centred, 0, chart.clientWidth - width)
        : centred
    const left = clamp(
      inChart,
      WINDOW_MARGIN - rect.left,
      clientWidth - WINDOW_MARGIN - width - rect.left,
    )
    // Room for the tooltip on each side; where neither fits, the roomier.
    const roomAbove = rect.top - GAP - WINDOW_MARGIN
    const roomBelow = clientHeight - WINDOW_MARGIN - rect.bottom - GAP
    const fits = (room: number) => room >= height
    const above =
      side === 'above'
        ? fits(roomAbove) || (!fits(roomBelow) && roomAbove >= roomBelow)
        : !fits(roomBelow) && (fits(roomAbove) || roomAbove > roomBelow)
    const top = above ? -GAP - height : chart.clientHeight + GAP
    box.style.transform = `translate(${left}px, ${top}px)`
    // It opens from the active point's edge of the tooltip.
    box.style.setProperty(
      '--chart-tooltip-origin',
      `${anchorX - left}px ${above ? height : 0}px`,
    )
  })
  return (
    // Placed by its transform, above the cards beside the chart; the box
    // inside animates.
    <div ref={ref} className="pointer-events-none absolute top-0 left-0 z-110">
      <div
        className={cn(
          tooltipSurfaceClassName,
          'chart-tooltip-enter flex flex-col gap-1 px-3 py-2',
        )}
      >
        {children}
      </div>
    </div>
  )
}

/** `min` wins where the range is empty: a window narrower than the tooltip. */
function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min)
}

/** Between the chart, labels included, and the tooltip. */
const GAP = 4

/** The least room left between the tooltip and the window's edge. */
const WINDOW_MARGIN = 8
