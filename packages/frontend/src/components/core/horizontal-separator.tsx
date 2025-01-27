import { cn } from '~/utils/cn'

export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return <hr className={cn('border-divider w-full md:border-t', className)} />
}
