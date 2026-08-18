import type { ReactNode } from 'react'
import { env } from '~/env'
import { LineChartIcon } from '~/icons/LineChart'
import { cn } from '~/utils/cn'

interface Props {
  /** A URL from `getCompareEntryUrl`. */
  href: string
  className?: string
  children?: ReactNode
}

/**
 * An entry point to the compare page, styled to sit among chart controls.
 * Renders nothing while `FEATURE_FLAG_COMPARE_PROJECTS` is off, so callers
 * can place it unconditionally.
 */
export function CompareProjectsLink({
  href,
  className,
  children = 'Compare projects',
}: Props) {
  if (!env.FEATURE_FLAG_COMPARE_PROJECTS) return null
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 font-medium text-xs md:px-3 md:text-sm',
        'bg-surface-primary primary-card:bg-surface-secondary hover:bg-surface-secondary primary-card:hover:bg-surface-tertiary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
        className,
      )}
    >
      <LineChartIcon className="size-4 shrink-0 fill-current" aria-hidden />
      {children}
    </a>
  )
}
