import { cn } from '~/utils/cn'

export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cn(
        'w-full border-gray-200 md:border-t dark:border-zinc-700',
        className,
      )}
    />
  )
}
