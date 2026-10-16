import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'

/**
 * Shown in place of a transfer list when the selection's count includes
 * lanes carried over from an older snapshot. Those lanes count transfers
 * from that snapshot's window, so the current window would list fewer
 * transfers than the count says.
 */
export function CarriedForwardNotice({
  carriedFrom,
  className,
}: {
  carriedFrom: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface-secondary px-3 py-2 font-medium text-paragraph-12 text-secondary',
        className,
      )}
    >
      Transfers can&apos;t be listed for this selection right now. Data for some
      of its chains is delayed, so the transfer count carries over figures last
      computed on {formatTimestamp(carriedFrom, { mode: 'datetime' })} and the
      transfers behind them fall outside the current window.
    </div>
  )
}
