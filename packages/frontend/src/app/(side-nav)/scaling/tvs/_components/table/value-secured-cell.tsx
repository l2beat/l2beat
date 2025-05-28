import { formatDollarValueNumber } from 'rewrite/src/utils/number-format/format-dollar-value-number'
import { ValueWithPercentageChange } from ~/utils/number - format / format - dollar - value - number

export interface ValueSecuredCellProps {
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
