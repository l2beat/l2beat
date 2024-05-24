import { cn } from '~/utils/cn'

export interface NavDividerProps {
  className?: string
}

export function NavDivider({ className }: NavDividerProps) {
  return (
    <div
      className={cn(
        'h-px w-full bg-gray-300 dark:bg-gray-850 xl:sidenav-collapsed:hidden',
        className,
      )}
    />
  )
}
