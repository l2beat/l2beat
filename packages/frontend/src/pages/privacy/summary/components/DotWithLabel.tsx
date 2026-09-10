import type { ReactNode } from 'react'

/**
 * A dot over a one-line label. The line is always reserved, so dots sit at
 * the same height across columns whether or not a cell has a label.
 */
export function DotWithLabel({
  dot,
  label,
}: {
  dot: ReactNode
  label?: string
}) {
  return (
    <span className="inline-flex flex-col items-center gap-1">
      {dot}
      <span className="h-3 whitespace-nowrap font-medium text-[11px] text-secondary leading-none">
        {label}
      </span>
    </span>
  )
}
