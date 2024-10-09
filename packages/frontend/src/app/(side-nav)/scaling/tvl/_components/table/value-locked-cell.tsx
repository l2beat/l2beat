import { PercentChange } from '~/components/percent-change'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/format'

export interface ValueLockedCellProps {
  value: number
  change: number
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  const showChange = data.change !== undefined && data.value !== 0
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1">
        <span className={cn('text-base', data.value !== 0 && 'font-bold')}>
          {data.value !== 0 ? formatCurrency(data.value, 'usd') : EM_DASH}
        </span>
        {showChange && data.change !== undefined && (
          <PercentChange
            value={data.change}
            className="ml-1 !text-base font-medium"
          />
        )}
      </div>
    </div>
  )
}
