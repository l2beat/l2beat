import { PercentChange } from '~/app/_components/percent-change'
import { formatNumber } from '~/utils/format-number'

export interface ValueLockedCellProps {
  value: number
  change?: number
  tokens: { symbol: string; iconUrl: string }[]
}

export function ValueLockedCell(data: ValueLockedCellProps) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1">
        <span className="text-base font-bold md:text-lg">
          ${formatNumber(data.value)}
        </span>
        {data.change !== undefined && (
          <PercentChange
            value={data.change}
            className="ml-1 !text-base font-medium"
          />
        )}
      </div>
    </div>
  )
}
