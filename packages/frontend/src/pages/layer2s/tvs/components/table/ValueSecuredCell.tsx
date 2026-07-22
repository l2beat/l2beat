import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'

interface ValueSecuredCellProps {
  value: number
  change: number
}

export function ValueSecuredCell(data: ValueSecuredCellProps) {
  return (
    <ValueWithPercentageChange
      change={data.change}
      containerClassName="inline-flex"
    >
      {formatDollarValueNumber(data.value)}
    </ValueWithPercentageChange>
  )
}
