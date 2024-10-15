import { PercentChange } from '~/components/percent-change'
import { cn } from '~/utils/cn'
import { formatTvlTableNumber } from '~/utils/number-format/format-tvl-number'

export interface ValueLockedCellProps {
  value: number
  change: number
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  const showChange = data.change !== undefined && data.value !== 0
  return (
    <div className="flex items-center">
      <span
        className={cn(
          'text-base',
          data.value !== 0 ? 'font-bold' : 'pr-14 text-secondary',
        )}
      >
        {formatTvlTableNumber(data.value)}
      </span>
      {showChange && data.change !== undefined && (
        <PercentChange
          value={data.change}
          className="ml-1 !text-base font-medium"
        />
      )}
    </div>
  )
}
