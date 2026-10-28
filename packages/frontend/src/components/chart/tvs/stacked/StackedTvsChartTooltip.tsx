import { assert, formatCurrency } from '@l2beat/shared-pure'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import type { ChartUnit } from '../../types'

export function StackedTvsChartTooltip<
  T extends { timestamp: number },
  K extends string,
>({
  row,
  keys,
  unit,
  meta,
}: {
  row: T
  /** Visible series, bottom of the stack first. */
  keys: K[]
  unit: ChartUnit
  meta: ChartMeta
}) {
  const label = row.timestamp
  const payload = getTooltipEntries(row, keys)

  const total = payload.reduce<number | null>((acc, curr) => {
    if (curr.value === null) {
      return acc
    }
    return (acc ?? 0) + curr.value
  }, null)
  const actualPayload = [...payload].reverse()

  return (
    <ChartTooltipWrapper>
      <div className="flex w-46 flex-col sm:w-66!">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { mode: 'datetime' })}
        </div>
        {actualPayload.length > 1 && (
          <>
            <div className="mt-3 flex w-full items-center justify-between gap-2 text-heading-16">
              <span className="[@media(min-width:600px)]:hidden">Total</span>
              <span className="hidden [@media(min-width:600px)]:inline">
                Total value secured
              </span>
              <span className="text-primary">
                {total !== null ? formatCurrency(total, unit) : 'No data'}
              </span>
            </div>
            <HorizontalSeparator className="mt-1.5" />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {actualPayload.map((entry) => {
            const config = meta[entry.name]
            assert(config, 'Chart meta is missing')
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <div className="flex items-end justify-end gap-1 max-sm:flex-col sm:items-center">
                  <span className="whitespace-nowrap font-medium text-label-value-15">
                    {entry.value !== null
                      ? formatCurrency(entry.value, unit)
                      : 'No data'}
                  </span>
                  {entry.value !== null && total !== null && (
                    <span className="font-medium text-label-value-13 text-secondary sm:text-label-value-15">
                      ({formatPercent(total !== 0 ? entry.value / total : 0)})
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
