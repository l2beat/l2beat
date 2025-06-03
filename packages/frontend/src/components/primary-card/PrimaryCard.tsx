import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { cn } from '~/utils/cn'

export function PrimaryCard({
  children,
  className,
  asChild,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'div'

  return (
    <Component
      className={cn(
        'group/primary-card primary-card bg-surface-primary p-4 md:rounded-xl md:px-6 md:py-5',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
