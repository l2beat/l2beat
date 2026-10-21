import { assert, formatCurrency } from '@l2beat/shared-pure'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import { ChartTooltipWrapper } from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import type { ChartUnit } from '../../types'

export function StackedTvsChartTooltip({
  payload,
  label,
  unit,
  meta,
}: CustomChartTooltipProps & { unit: ChartUnit; meta: ChartMeta }) {
  if (!payload || typeof label !== 'number') return null

  const total = payload.reduce<number | null>((acc, curr) => {
    if (curr.value === null || curr.value === undefined || curr.hide) {
      return acc
    }
    if (acc === null) {
      return curr?.value ?? null
    }
    return acc + curr.value
  }, null)
  const actualPayload = [...payload].reverse().filter((entry) => !entry.hide)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-46 flex-col sm:w-66!">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
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
            if (entry.type === 'none') return null
            const config = meta[entry.name as string]
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
                    {entry.value !== null && entry.value !== undefined
                      ? formatCurrency(entry.value, unit)
                      : 'No data'}
                  </span>
                  {entry.value !== null &&
                    entry.value !== undefined &&
                    total !== null && (
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
