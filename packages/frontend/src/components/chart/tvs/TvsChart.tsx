import { formatCurrency } from '@l2beat/shared-pure'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { formatSnapshotTimestamp } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'
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
  resolution,
  skipNull,
}: {
  row: T
  keys: K[]
  unit: ChartUnit
  resolution: ChartResolution
  /** Leave out series without a value, instead of showing "No data". */
  skipNull?: boolean
}) {
  const label = row.timestamp
  const payload = getTooltipEntries(row, keys, { skipNull })

  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col">
        <ChartTooltipTitle className="mb-3">
          {formatSnapshotTimestamp(label, resolution)}
        </ChartTooltipTitle>
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
