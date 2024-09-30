import { NumberCell } from '~/components/table/cells/number-cell'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatTps } from '~/utils/format-tps'

interface Props {
  maxTps: number
  timestamp: number
}

export function MaxTpsCell({ maxTps, timestamp }: Props) {
  return (
    <span className="flex items-baseline gap-1.5">
      <NumberCell>{formatTps(maxTps)}</NumberCell>
      <span
        className={cn(
          'text-gray-700 dark:text-gray-300',
          'block min-w-[115px] text-left',
        )}
      >
        on {formatTimestamp(timestamp)}
      </span>
    </span>
  )
}
