import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'

export interface ValueLockedCellProps {
  value: number
  change: number
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  return (
    <ValueWithPercentageChange change={data.change}>
      {formatDollarValueNumber(data.value)}
    </ValueWithPercentageChange>
  )
}
