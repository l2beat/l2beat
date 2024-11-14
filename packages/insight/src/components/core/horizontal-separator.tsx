import { cn } from '~/utils/cn'

export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return <hr className={cn('w-full border-divider md:border-t', className)} />
}
