import type { ReactNode } from 'react'
import { CssVariables } from '~/components/CssVariables'
import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'

interface StatCardProps {
  color?: string
  className?: string
  title: ReactNode
  isLoading: boolean
  loadingContent?: ReactNode
  children?: ReactNode
  footer?: ReactNode
}

export function StatCard({
  color,
  className,
  title,
  isLoading,
  loadingContent,
  children,
  footer,
}: StatCardProps) {
  const body = (
    <>
      <div className="text-center font-medium text-label-value-13 md:text-label-value-14 lg:text-label-value-16">
        {title}
      </div>
      <div className="flex flex-col items-center justify-center pt-2">
        {isLoading
          ? (loadingContent ?? (
              <Skeleton className="min-h-[23px] w-[4.75rem] shrink-0 md:min-h-7 md:w-[6rem]" />
            ))
          : children}
        {footer}
      </div>
    </>
  )

  if (!color) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-divider bg-surface-primary',
          className,
        )}
      >
        {body}
      </div>
    )
  }

  return (
    <CssVariables variables={{ 'stat-color': color }}>
      <div
        className={cn(
          'flex h-full flex-col items-center justify-center rounded-lg border border-[var(--stat-color)] p-2 md:p-4',
          className,
        )}
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--stat-color) 10%, var(--surface-primary))',
        }}
      >
        {body}
      </div>
    </CssVariables>
  )
}
