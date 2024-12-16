import { cn } from '~/utils/cn'

export interface SeparatorProps {
  className?: string
}
export function VerticalSeparator({ className }: SeparatorProps) {
  return <hr className={cn('h-full border-divider md:border-r', className)} />
}
