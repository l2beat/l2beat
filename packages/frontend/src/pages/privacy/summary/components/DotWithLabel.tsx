import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * A dot over a one-line label. The line is always reserved, so dots sit at
 * the same height across columns whether or not a cell has a label.
 */
export function DotWithLabel({
  dot,
  label,
  className,
}: {
  dot: ReactNode
  label?: string
  className?: string
}) {
  return (
    <span className={cn('inline-flex flex-col items-center gap-1', className)}>
      {dot}
      <span className="h-3 whitespace-nowrap font-medium text-[11px] text-secondary leading-none">
        {label}
      </span>
    </span>
  )
}
