import { formatDollarValueNumber } from '@l2beat/shared-pure'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'

interface ValueSecuredCellProps {
  value: number
  change: number
  changePeriod: PercentageChangePeriod
}

export function ValueSecuredCell(data: ValueSecuredCellProps) {
  return (
    <ValueWithPercentageChange
      change={data.change}
      changePeriod={data.changePeriod}
      disabledOnMobile
      containerClassName="inline-flex"
    >
      {formatDollarValueNumber(data.value)}
    </ValueWithPercentageChange>
  )
}
