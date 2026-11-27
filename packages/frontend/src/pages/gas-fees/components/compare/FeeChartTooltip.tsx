import { UnixTime } from '@l2beat/shared-pure'
import {
  ChartTooltipNote,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import type { GasFeesChartKey } from '~/server/features/gas-fees/chains'
import { compareCosts } from '../../utils/compare'
import { formatDate, formatDays } from '../../utils/format'
import type { FeeChartRow } from './FeeChart'

/** Sorted by value, each line against Ethereum's on the same point */
export function FeeChartTooltip({
  row,
  keys,
  weekly,
  format,
}: {
  row: FeeChartRow
  keys: GasFeesChartKey[]
  /** Whether the point averages the 7 days up to it */
  weekly: boolean
  format: (value: number) => string
}) {
  const ethereum = row.ethereum ?? null
  const entries = getTooltipEntries(row, keys).sort(
    (a, b) =>
      (b.value ?? Number.NEGATIVE_INFINITY) -
      (a.value ?? Number.NEGATIVE_INFINITY),
  )
  return (
    <ChartTooltipWrapper>
      <ChartTooltipTitle className="mb-2">
        {weekly
          ? formatDays(row.timestamp - 6 * UnixTime.DAY, row.timestamp)
          : formatDate(row.timestamp)}
        {weekly && <span className="block text-2xs">7-day average</span>}
      </ChartTooltipTitle>
      <div className="flex flex-col gap-1.5">
        {entries.map((entry) => {
          const comparison =
            entry.name !== 'ethereum' &&
            entry.value !== null &&
            ethereum !== null
              ? compareCosts(entry.value, ethereum)
              : undefined
          return (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <span className="flex items-baseline gap-2">
                {comparison && (
                  <ChartTooltipNote>
                    {comparison.ratio}{' '}
                    {comparison.cheaper ? 'cheaper' : 'dearer'}
                  </ChartTooltipNote>
                )}
                <ChartTooltipValue
                  value={entry.value}
                  format={format}
                  className="tabular-nums"
                />
              </span>
            </ChartTooltipRow>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
