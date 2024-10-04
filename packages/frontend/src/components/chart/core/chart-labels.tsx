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
          className={cn(hideBottomLabel && i === 0 && '!text-transparent')}
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
}: {
  children?: ReactNode
  isLoading: boolean
  className?: string
}) {
  return (
    <div className="relative">
      {!isLoading ? (
        <span
          className={cn(
            'absolute bottom-0 left-1 pb-0.5 text-sm text-gray-500 dark:text-white',
            'sidebar:text-zinc-500 sidebar:dark:text-zinc-300',
            className,
          )}
        >
          {children}
        </span>
      ) : null}
      <hr
        className={cn(
          'border-gray-850/30 dark:border-white/30',
          'sidebar:border-zinc-500/30 sidebar:dark:border-zinc-300/30',
        )}
      />
    </div>
  )
}
