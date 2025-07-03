import { cn } from '~/utils/cn'

export interface SeparatorProps {
  className?: string
}
export function VerticalSeparator({ className }: SeparatorProps) {
  return <div className={cn('h-full border-divider border-r', className)} />
}
