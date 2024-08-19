import { PercentChange } from '~/app/_components/percent-change'
import { EM_DASH } from '~/consts/characters'
import { formatNumber } from '~/utils/format-number'

export interface ValueLockedCellProps {
  value: number
  change: number
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  const showChange = data.change !== undefined && data.value !== 0
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1">
        <span className="text-base font-bold md:text-lg">
          {data.value === 0 ? EM_DASH : formatNumber(data.value)}
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
