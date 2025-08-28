import { cn } from '~/utils/cn'

interface Props {
  children: string
  className?: string
  maxChars?: number
}

export function EllipsisText({ children, className, maxChars = 20 }: Props) {
  return (
    // tabIndex is required to make the div focusable
    <span
      className={cn('group/text-ellipsis relative', className)}
      tabIndex={0}
    >
      {children.slice(0, maxChars).trimEnd()}
      {children.length > maxChars && <span>&hellip;</span>}
      {children.length > maxChars && (
        <div className="absolute inset-y-0 hidden bg-primary text-primary-invert group-hover/text-ellipsis:block group-focus/text-ellipsis:block">
          {children}
        </div>
      )}
    </span>
  )
}
