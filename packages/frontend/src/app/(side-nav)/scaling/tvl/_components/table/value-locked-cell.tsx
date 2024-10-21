import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { formatTvlTableNumber } from '~/utils/number-format/format-tvl-number'

export interface ValueLockedCellProps {
  value: number
  change: number
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  return (
    <ValueWithPercentageChange change={data.change}>
      {formatTvlTableNumber(data.value)}
    </ValueWithPercentageChange>
  )
}
