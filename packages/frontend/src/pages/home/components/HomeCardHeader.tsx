import type { ReactNode } from 'react'
import { ViewDetailsLink } from '~/components/ViewDetailsLink'
import { cn } from '~/utils/cn'

export function HomeCardHeader({
  title,
  badge,
  href,
  linkLabel = 'View details',
  timeframe,
  className,
}: {
  title: string
  badge?: ReactNode
  href?: string
  linkLabel?: string
  timeframe?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-xl">{title}</h2>
        {badge}
      </div>
      {(timeframe !== undefined || href) && (
        <div className="flex items-center gap-3">
          {timeframe !== undefined && (
            <span className="font-medium text-[13px] text-secondary leading-none">
              {timeframe}
            </span>
          )}
          {href && <ViewDetailsLink href={href} label={linkLabel} />}
        </div>
      )}
    </div>
  )
}
