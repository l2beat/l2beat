import type { ComponentProps } from 'react'
import { cn } from '~/utils/cn'

export function PrimaryCard({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-surface-primary p-4 primary-card md:rounded-xl md:px-6 md:py-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
