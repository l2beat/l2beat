import { cn } from '~/utils/cn'

interface Props {
  children: number
  className?: string
}

export function CountBadge({ children, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-full bg-brand px-2 py-0.5 font-medium text-2xs text-primary-invert tabular-nums',
        className,
      )}
    >
      {children}
    </div>
  )
}
