import { cn } from '~/utils/cn'

export interface SeparatorProps {
  className?: string
}
export function VerticalSeparator({ className }: SeparatorProps) {
  return <hr className={cn('border-divider h-full md:border-r', className)} />
}
