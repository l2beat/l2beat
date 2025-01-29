import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'

export interface ValueSecuredCellProps {
  value: number
  change: number
}

export function ValueSecuredCell(data: ValueSecuredCellProps) {
  return (
    <ValueWithPercentageChange change={data.change}>
      {formatDollarValueNumber(data.value)}
    </ValueWithPercentageChange>
  )
}
