import { formatCurrency } from '@l2beat/shared-pure'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
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
  const label = row.timestamp
  const payload = getTooltipEntries(row, keys, { skipNull })

  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col">
        <div className="mb-3 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, {
            mode: 'datetime',
          })}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name} gap="gap-x-1">
              <ChartTooltipValue
                value={entry.value}
                format={(value) => formatCurrency(value, unit)}
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
