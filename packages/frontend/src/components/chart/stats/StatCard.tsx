import type { CSSProperties, ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'

interface StatCardProps {
  color?: string
  className?: string
  title: ReactNode
  isLoading: boolean
  children?: ReactNode
  footer?: ReactNode
}

/**
 * Title, value and footer sit in rows shared with the other cards of the
 * `StatsGrid`, so a two-line title or a footer on one card doesn't move its
 * value out of line with the rest.
 */
export function StatCard({
  color,
  className,
  title,
  isLoading,
  children,
  footer,
}: StatCardProps) {
  const body = (
    <>
      <div className="self-end text-center font-medium text-label-value-13 md:text-label-value-14 lg:text-label-value-16">
        {title}
      </div>
      <div className="flex flex-col items-center justify-center pt-2">
        {isLoading ? (
          <Skeleton className="h-6 w-24 shrink-0 md:min-h-7 md:w-32" />
        ) : (
          children
        )}
      </div>
      <div className="flex flex-col items-center">{footer}</div>
    </>
  )

  if (!color) {
    return (
      <div
        className={cn(
          'row-span-3 grid grid-rows-subgrid justify-items-center gap-0 rounded-lg border border-divider bg-surface-primary',
          className,
        )}
      >
        {body}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'row-span-3 grid grid-rows-subgrid justify-items-center gap-0 rounded-lg border border-[var(--stat-color)] p-2 md:p-4 lg:py-5',
        className,
      )}
      style={
        {
          '--stat-color': color,
          backgroundColor:
            'color-mix(in srgb, var(--stat-color) 10%, var(--surface-primary))',
        } as CSSProperties
      }
    >
      {body}
    </div>
  )
}
