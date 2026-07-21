import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

export function HomeCardHeader({
  title,
  href,
  linkLabel = 'View details',
  timeframe,
  className,
}: {
  title: string
  href?: string
  linkLabel?: string
  timeframe?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <h2 className="font-bold text-xl">{title}</h2>
      {(timeframe !== undefined || href) && (
        <div className="flex items-center gap-3">
          {timeframe !== undefined && (
            <span className="font-medium text-[13px] text-secondary leading-none">
              {timeframe}
            </span>
          )}
          {href && (
            <a
              className="group flex items-center gap-1 font-medium text-[13px] text-link leading-none"
              href={href}
            >
              <span className="underline-offset-2 group-hover:underline">
                {linkLabel}
              </span>
              <ChevronIcon className="-rotate-90 size-2.5 fill-current transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
