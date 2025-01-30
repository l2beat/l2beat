import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { useChartContext } from './chart-context'
import { useChartLoading } from './chart-loading-context'

export const FIRST_LABEL_HEIGHT_PX = 20

interface Props {
  className?: string
}

export function ChartLabels({ className }: Props) {
  const { labels, columns } = useChartContext()
  const isLoading = useChartLoading()
  return (
    <div
      className={cn(
        'pointer-events-none relative flex h-full flex-col-reverse justify-between pt-5',
        columns.length <= 1 && !isLoading && 'chart-fade-out-to-bottom',
        className,
      )}
    >
      {labels.map((label, i) => (
        <ChartLabel key={i} isLoading={isLoading}>
          {label}
        </ChartLabel>
      ))}
    </div>
  )
}

function ChartLabel({
  children,
  isLoading,
  className,
}: {
  children?: ReactNode
  isLoading: boolean
  className?: string
}) {
  return (
    <div className="relative">
      {!isLoading && children ? (
        <span
          className={cn(
            'absolute bottom-0 left-1 pb-0.5 text-sm text-primary opacity-50 dark:opacity-70',
            className,
          )}
        >
          {children}
        </span>
      ) : null}
      <hr className={cn('border-primary opacity-25 dark:opacity-40')} />
    </div>
  )
}
