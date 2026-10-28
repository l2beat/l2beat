import { assert, formatCurrency } from '@l2beat/shared-pure'
import { useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  getTooltipEntries,
  TsChartTooltipWrapper,
} from '~/components/core/chart/tanstack/TsTimeSeriesChart'
import { formatTimestamp } from '~/utils/dates'
import type { ChartUnit } from '../types'

export interface TvsChartDataPoint {
  timestamp: number
  value: number | null
}

export function TvsCustomTooltip<
  T extends { timestamp: number },
  K extends string,
>({
  row,
  keys,
  unit,
  skipNull,
}: {
  row: T
  keys: K[]
  unit: ChartUnit
  /** Leave out series without a value, instead of showing "No data". */
  skipNull?: boolean
}) {
  const { meta } = useChart()
  const label = row.timestamp
  const payload = getTooltipEntries(row, keys, { skipNull })

  return (
    <TsChartTooltipWrapper>
      <div className="flex min-w-28 flex-col">
        <div className="mb-3 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, {
            mode: 'datetime',
          })}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
            const config = meta[entry.name]
            assert(config, 'No config')

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
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== null && entry.value !== undefined
                    ? formatCurrency(entry.value, unit)
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </TsChartTooltipWrapper>
  )
}
