import { UnixTime } from '@l2beat/shared-pure'
import { type ReactNode, useLayoutEffect, useRef } from 'react'
import type { CustomChartTooltipProps } from '~/components/core/chart/Chart'
import { ChartTooltipWrapper, useChart } from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { tooltipContentVariants } from '~/components/core/tooltip/Tooltip'
import { WEEK_DAYS } from '~/server/features/home/homeSeries'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'
import type { SparklinePoint } from './sparklineScale'

export function SparklineTooltip({
  payload,
  label,
  formatValue,
  partLabels,
  weeklyAverage,
  fingerX,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  partLabels: string[] | undefined
  weeklyAverage: boolean | undefined
  /**
   * Where a finger scrubs the chart, in the chart's pixels: the tooltip then
   * goes compact and follows it above the chart (see `FingerTooltip`).
   */
  fingerX?: number
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null
  const entry = payload[0]
  const config = entry?.name !== undefined ? meta[entry.name] : undefined
  if (!entry || !config) return null
  const point = entry.payload as SparklinePoint | undefined
  const date = weeklyAverage
    ? formatRange(label, label + WEEK_DAYS * UnixTime.DAY)
    : formatTimestamp(label)
  const format = (value: unknown) =>
    typeof value === 'number' ? formatValue(value) : 'No data'
  const parts = (partLabels ?? []).map((partLabel, index) => ({
    label: partLabel,
    value: point?.parts[index],
  }))

  if (fingerX !== undefined) {
    // The series is named beside the chart, so the date and the value do.
    return (
      <FingerTooltip fingerX={fingerX}>
        <div className="whitespace-nowrap text-label-value-13 text-secondary">
          {date}
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
        {parts.map((part) => (
          <div
            key={part.label}
            className="flex justify-between gap-3 whitespace-nowrap text-label-value-13"
          >
            <span className="text-secondary">{part.label}</span>
            <span className="font-medium tabular-nums">
              {format(part.value)}
            </span>
          </div>
        ))}
      </FingerTooltip>
    )
  }

  const rows = [
    {
      id: 'value',
      label: weeklyAverage ? `${config.label}, daily average` : config.label,
      value: entry.value,
      indicator: true,
    },
    ...parts.map((part) => ({ id: part.label, ...part, indicator: false })),
  ]
  return (
    <ChartTooltipWrapper>
      <div className="flex w-50 flex-col gap-2 sm:w-60">
        <div className="mb-1 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {date}
        </div>
        {rows.map((row, index) => (
          <div key={row.id}>
            {index === 1 && <HorizontalSeparator className="mb-2" />}
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {row.indicator && (
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                )}
                <span className="font-medium text-label-value-14">
                  {row.label}
                </span>
              </div>
              <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                {format(row.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartTooltipWrapper>
  )
}

/**
 * A finger scrubbing a chart covers what lies under and beside it, so the
 * tooltip sits clear above the whole chart, labels and all, centred on the
 * finger and kept inside the window. Where the window has no room above the
 * chart, it goes under it instead. Recharts leaves the wrapper where the chart
 * puts it (its corner); after every render this moves it into place, before
 * the frame is painted.
 */
function FingerTooltip({
  fingerX,
  children,
}: {
  fingerX: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const box = ref.current
    const wrapper = box?.closest<HTMLElement>('.recharts-tooltip-wrapper')
    const chart = wrapper?.offsetParent
    if (!box || !wrapper || !chart) return
    const { left: chartLeft, top: chartTop } = chart.getBoundingClientRect()
    const { offsetWidth: width, offsetHeight: height } = box
    const windowWidth = document.documentElement.clientWidth
    const left = Math.min(
      Math.max(chartLeft + fingerX - width / 2, WINDOW_MARGIN),
      windowWidth - WINDOW_MARGIN - width,
    )
    const fitsAbove = chartTop - FINGER_GAP - height >= WINDOW_MARGIN
    const top = fitsAbove
      ? -FINGER_GAP - height
      : chart.clientHeight + FINGER_GAP
    wrapper.style.transform = `translate(${left - chartLeft}px, ${top}px)`
  })
  return (
    <div
      ref={ref}
      className={cn(
        tooltipContentVariants({ fitContent: true }),
        'flex flex-col gap-1 px-3 py-2',
      )}
    >
      {children}
    </div>
  )
}

/** Between the chart, labels included, and the tooltip over it. */
const FINGER_GAP = 12

/** The least room left between the tooltip and the window's edge. */
const WINDOW_MARGIN = 8
