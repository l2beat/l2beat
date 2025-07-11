import { cn } from '~/utils/cn'

export interface SeparatorProps {
  className?: string
}
export function VerticalSeparator({ className }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cn('h-full border-divider border-r', className)}
    />
  )
}
