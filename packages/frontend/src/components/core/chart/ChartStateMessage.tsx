import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * The message a chart shows in place of its plot ("No data", "Couldn't load
 * chart"). Shared so every such state looks the same.
 */
export function ChartStateMessage({
  size,
  icon,
  title,
  description,
  action,
}: {
  size: 'regular' | 'small'
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  const titleElement = (
    <span
      className={cn(
        'font-medium text-2xl text-yellow-700 leading-none dark:text-yellow-200',
        size === 'small' && 'text-xl',
      )}
    >
      {title}
    </span>
  )

  return (
    <div
      className={cn(
        'absolute inset-0 z-30 flex select-none flex-col items-center justify-center px-4 text-center',
        // Center on the plot, not plot plus legend, as the loader does
        'group-has-[.recharts-legend-wrapper]:pb-7',
      )}
    >
      {size === 'regular' ? (
        <>
          {icon}
          {/* Title and description read as one block, apart from icon and action */}
          <div className="mt-4 flex flex-col items-center gap-2 max-md:mt-3">
            {titleElement}
            <span className="text-secondary text-sm">{description}</span>
          </div>
          {action && <div className="mt-5 max-md:mt-4">{action}</div>}
        </>
      ) : (
        // A small chart has room for one line, so the action sits beside the title
        <div className="flex items-center gap-3">
          {titleElement}
          {action}
        </div>
      )}
    </div>
  )
}

export const chartStateIconClassName = 'fill-yellow-700 dark:fill-yellow-200'
