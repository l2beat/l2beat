import { cn } from '~/utils/cn'

export function Last24HoursBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded bg-n-blue-700 px-1.5 py-[3px] font-bold text-sm text-white leading-[1.15]',
        className,
      )}
    >
      Last 24 hours
    </div>
  )
}
