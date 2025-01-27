import { cn } from '~/utils/cn'

export interface NavDividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function NavDivider({
  className,
  orientation = 'horizontal',
}: NavDividerProps) {
  return (
    <div
      className={cn(
        'dark:bg-gray-850 bg-gray-300 transition-colors duration-300 ease-out',
        orientation === 'horizontal' && 'h-px w-full',
        orientation === 'vertical' && 'h-full w-px',
        className,
      )}
    />
  )
}
