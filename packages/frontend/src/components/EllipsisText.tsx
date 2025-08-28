import { cn } from '~/utils/cn'

interface Props {
  children: string
  className?: string
  maxChars?: number
  accessoryRight?: React.ReactNode
}

export function EllipsisText({
  children,
  className,
  maxChars = 20,
  accessoryRight,
}: Props) {
  return (
    // tabIndex is required to make the div focusable
    <span
      className={cn('group/text-ellipsis relative', className)}
      tabIndex={0}
    >
      {children.slice(0, maxChars).trimEnd()}
      {children.length > maxChars && <span>&hellip;</span>}
      {children.length > maxChars && (
        <div className="absolute inset-y-0 z-10 hidden bg-surface-secondary text-primary group-hover/text-ellipsis:block group-focus/text-ellipsis:block">
          {children}
          {accessoryRight}
        </div>
      )}
    </span>
  )
}
