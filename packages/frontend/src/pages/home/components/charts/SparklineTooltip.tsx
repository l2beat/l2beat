import { UnixTime } from '@l2beat/shared-pure'
import { type ReactNode, useLayoutEffect, useRef } from 'react'
import type { CustomChartTooltipProps } from '~/components/core/chart/Chart'
import { tooltipContentVariants } from '~/components/core/tooltip/Tooltip'
import { WEEK_DAYS } from '~/server/features/home/homeSeries'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'
import type { SparklinePoint } from './sparklineScale'

/**
 * The date and the value under the cursor or finger, compact: the series is
 * named beside the chart. Placed off the chart by `PointTooltip`.
 */
export function SparklineTooltip({
  payload,
  label,
  formatValue,
  partLabels,
  weeklyAverage,
  anchorX,
  side,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  partLabels: string[] | undefined
  weeklyAverage: boolean | undefined
  /** The active point's x, in the chart's pixels. */
  anchorX: number | undefined
  side: 'above' | 'below'
}) {
  const entry = payload?.[0]
  if (!entry || typeof label !== 'number' || anchorX === undefined) {
    return null
  }
  const point = entry.payload as SparklinePoint | undefined
  const format = (value: unknown) =>
    typeof value === 'number' ? formatValue(value) : 'No data'
  return (
    <PointTooltip anchorX={anchorX} side={side}>
      <div className="whitespace-nowrap text-label-value-13 text-secondary">
        {weeklyAverage
          ? formatRange(label, label + WEEK_DAYS * UnixTime.DAY)
          : formatTimestamp(label)}
      </div>
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="font-semibold text-label-value-15 tabular-nums">
          {format(entry.value)}
        </span>
        {weeklyAverage && (
          <span className="text-label-value-13 text-secondary">
            daily average
          </span>
        )}
      </div>
      {partLabels?.map((partLabel, index) => (
        <div
          key={partLabel}
          className="flex justify-between gap-3 whitespace-nowrap text-label-value-13"
        >
          <span className="text-secondary">{partLabel}</span>
          <span className="font-medium tabular-nums">
            {format(point?.parts[index])}
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
 * inside the window. Recharts leaves the wrapper where the chart puts it (its
 * corner); after every render this moves it into place, before the frame is
 * painted.
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
    const wrapper = box?.closest<HTMLElement>('.recharts-tooltip-wrapper')
    const chart = wrapper?.offsetParent
    if (!box || !wrapper || !chart) return
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
    wrapper.style.transform = `translate(${left}px, ${top}px)`
  })
  return (
    <div
      ref={ref}
      className={cn(
        tooltipContentVariants({ fitContent: true }),
        // Lines without leading need 2px more to look as far from the top
        // and bottom as from the sides.
        'flex flex-col gap-1 px-4 py-3.5',
      )}
    >
      {children}
    </div>
  )
}

/** `min` wins where the range is empty: a window narrower than the tooltip. */
function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min)
}

/** Between the chart, labels included, and the tooltip. */
const GAP = 12

/** The least room left between the tooltip and the window's edge. */
const WINDOW_MARGIN = 8
