import { PercentChange } from '~/components/percent-change'
import { formatTvlTableNumber } from '~/utils/number-format/format-tvl-number'

export interface ValueLockedCellProps {
  value: number
  change: number
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  return (
    <div className="flex items-center">
      <span className="text-base font-bold">
        {formatTvlTableNumber(data.value)}
      </span>
      <PercentChange
        value={data.change}
        className="ml-1 !text-base font-medium"
      />
    </div>
  )
}
