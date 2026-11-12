import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { formatPercent } from '../format'
import type { Weeks } from '../weekly'

/**
 * A section's week in one sentence, set large enough to be the first thing
 * read. The figures carry the weight; the dates say which week, since the
 * sentence only changes at 00:00 UTC.
 */
export function Story({
  weeks,
  children,
}: {
  weeks: Weeks | undefined
  children: ReactNode
}) {
  if (!weeks) return null
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-medium text-label-value-12 text-secondary uppercase tracking-wide">
        Past 7 days · {weeks.label}
      </span>
      <p className="max-w-[64ch] text-paragraph-16 text-primary md:text-paragraph-18">
        {children}
      </p>
    </div>
  )
}

/** A figure inside a story */
export function Fig({ children }: { children: ReactNode }) {
  return <strong className="font-bold tabular-nums">{children}</strong>
}

/**
 * "12% more than the week before". Within half a percent reads as "about the
 * same", since the third digit of a weekly total is noise.
 */
export function Change({
  change,
  more = 'more',
  less = 'less',
  className,
}: {
  change: number
  more?: string
  less?: string
  className?: string
}) {
  if (Math.abs(change) < 0.005) {
    return <span className={className}>about the same as the week before</span>
  }
  return (
    <span className={cn('tabular-nums', className)}>
      <Fig>{formatPercent(Math.abs(change))}</Fig> {change > 0 ? more : less}{' '}
      than the week before
    </span>
  )
}
