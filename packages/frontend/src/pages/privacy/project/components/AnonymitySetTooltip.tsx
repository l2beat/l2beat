import type { ReactNode } from 'react'
import type { CustomChartTooltipProps } from '~/components/core/chart/Chart'
import { ChartTooltipWrapper, useChart } from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatInteger } from '~/utils/number-format/formatInteger'

/** Beyond this the tooltip is taller than the chart, so the tail is summarised. */
const MAX_TOOLTIP_ROWS = 12

interface Props {
  payload: CustomChartTooltipProps['payload']
  /** What the hovered point is - the only thing that differs per chart. */
  title: ReactNode
}

/**
 * Ranked set sizes at one point, shared by every anonymity set chart.
 *
 * Most series are empty at any given point, and listing them all makes a
 * tooltip taller than the chart. Shows the biggest sets, drops the empty ones.
 */
export function AnonymitySetTooltip({ payload, title }: Props) {
  const { meta } = useChart()
  if (!payload) return null

  const ranked = payload
    .filter(
      (entry) =>
        entry.name !== undefined &&
        !entry.hide &&
        entry.type !== 'none' &&
        Number(entry.value ?? 0) > 0,
    )
    .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0))
  const shown = ranked.slice(0, MAX_TOOLTIP_ROWS)
  const hiddenCount = ranked.length - shown.length

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {title}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {shown.map((entry) => {
          if (entry.name === undefined) return null

          const config = meta[entry.name]
          if (!config) return null

          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  type={config.indicatorType}
                  backgroundColor={config.color}
                />
                <span className="font-medium text-label-value-14">
                  {config.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {formatInteger(Number(entry.value ?? 0))}
              </span>
            </div>
          )
        })}
        {ranked.length === 0 && (
          <div className="font-medium text-label-value-14 text-secondary">
            No deposits in this window
          </div>
        )}
        {hiddenCount > 0 && (
          <div className="font-medium text-label-value-14 text-secondary">
            +{hiddenCount} smaller
          </div>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}
