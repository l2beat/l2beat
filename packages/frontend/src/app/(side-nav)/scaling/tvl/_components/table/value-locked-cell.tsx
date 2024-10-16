import { PercentChange } from '~/components/percent-change'
import { PrimaryValueCell } from '~/components/table/cells/primary-value-cell'
import { formatTvlTableNumber } from '~/utils/number-format/format-tvl-number'

export interface ValueLockedCellProps {
  value: number
  change: number
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  return (
    <PrimaryValueCell className="flex items-center">
      <span className="font-bold">{formatTvlTableNumber(data.value)}</span>
      <PercentChange value={data.change} className="ml-1 font-medium" />
    </PrimaryValueCell>
  )
}
