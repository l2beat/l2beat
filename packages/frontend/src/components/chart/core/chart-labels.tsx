import { type ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { useChartContext } from './chart-context'
import { useChartLoading } from './chart-loading-context'

export const FIRST_LABEL_HEIGHT_PX = 20

interface Props {
  className?: string
  hideBottomLabel?: boolean
}

export function ChartLabels({ className, hideBottomLabel }: Props) {
  const { labels, columns } = useChartContext()
  const isLoading = useChartLoading()
  return (
    <div
      className={cn(
        'pointer-events-none relative z-25 flex h-full flex-col-reverse justify-between pt-5',
        columns.length <= 1 && !isLoading && 'chart-fade-out-to-bottom',
        className,
      )}
    >
      {labels.map((label, i) => (
        <ChartLabel
          key={i}
          isLoading={isLoading}
          className={cn(hideBottomLabel && i === 0 && 'invisible')}
        >
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
}: { children?: ReactNode; isLoading: boolean; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      {!isLoading ? (
        <span className="absolute bottom-0 left-0 pb-0.5 text-sm text-gray-500 text-opacity-50 dark:text-white dark:text-opacity-50">
          {children}
        </span>
      ) : null}
      <hr className="border-gray-850/30 dark:border-white/30" />
    </div>
  )
}
