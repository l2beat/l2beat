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
  return (
    <div className="absolute inset-0 z-30 flex select-none flex-col items-center justify-center gap-4 text-center">
      {size === 'regular' && icon}
      <span
        className={cn(
          'font-medium text-2xl text-yellow-700 leading-none dark:text-yellow-200',
          size === 'small' && 'text-xl',
        )}
      >
        {title}
      </span>
      {size === 'regular' && <span className="text-sm">{description}</span>}
      {action}
    </div>
  )
}

export const chartStateIconClassName = 'fill-yellow-700 dark:fill-yellow-200'
