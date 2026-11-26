import { formatCurrency } from '@l2beat/shared-pure'
import {
  ChartTooltipNote,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
  sumEntries,
} from '~/components/core/chart/ChartTooltip'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatSnapshotTimestamp } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'
import type { ChartUnit } from '../../types'

export function StackedTvsChartTooltip<
  T extends { timestamp: number },
  K extends string,
>({
  row,
  keys,
  unit,
  resolution,
}: {
  row: T
  /** Visible series, bottom of the stack first. */
  keys: K[]
  unit: ChartUnit
  resolution: ChartResolution
}) {
  const label = row.timestamp
  const payload = getTooltipEntries(row, keys)

  const total = sumEntries(payload)
  const actualPayload = [...payload].reverse()

  return (
    <ChartTooltipWrapper>
      <div className="flex w-46 flex-col sm:w-66!">
        <ChartTooltipTitle>
          {formatSnapshotTimestamp(label, resolution)}
        </ChartTooltipTitle>
        {actualPayload.length > 1 && (
          <TooltipHeader
            className="mt-3"
            label={
              <>
                <span className="[@media(min-width:600px)]:hidden">Total</span>
                <span className="hidden [@media(min-width:600px)]:inline">
                  Total value secured
                </span>
              </>
            }
            value={total !== null ? formatCurrency(total, unit) : 'No data'}
          />
        )}
        <div className="mt-2 flex flex-col gap-2">
          {actualPayload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name} gap="gap-x-1">
              <div className="flex items-end justify-end gap-1 max-sm:flex-col sm:items-center">
                <ChartTooltipValue
                  value={entry.value}
                  format={(value) => formatCurrency(value, unit)}
                />
                {entry.value !== null && total !== null && (
                  <ChartTooltipNote>
                    ({formatPercent(total !== 0 ? entry.value / total : 0)})
                  </ChartTooltipNote>
                )}
              </div>
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
