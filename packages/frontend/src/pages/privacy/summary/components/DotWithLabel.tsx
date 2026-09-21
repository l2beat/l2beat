import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * A dot over a one-line label. The line is always reserved, so dots sit at
 * the same height across columns whether or not a cell has a label. A second
 * line carries a qualifier the label cannot hold on its own, such as the
 * walkaway test under the exit window.
 */
export function DotWithLabel({
  dot,
  label,
  detail,
  detailClassName,
  className,
}: {
  dot: ReactNode
  label?: string
  detail?: string
  detailClassName?: string
  className?: string
}) {
  return (
    <span className={cn('inline-flex flex-col items-center gap-1', className)}>
      {dot}
      <span className="h-3 whitespace-nowrap font-medium text-[11px] text-secondary leading-none">
        {label}
      </span>
      {detail && (
        <span
          className={cn(
            'whitespace-nowrap text-[11px] text-secondary leading-none',
            detailClassName,
          )}
        >
          {detail}
        </span>
      )}
    </span>
  )
}
