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
        'group/primary-card relative bg-surface-primary p-4 primary-card md:rounded-xl md:px-6 md:py-5',
        'data-[highlighted]:before:absolute data-[highlighted]:before:inset-0 data-[highlighted]:before:rounded-lg data-[highlighted]:before:border-2 data-[highlighted]:before:border-brand data-[highlighted]:before:shadow-[0px_4px_12px_10px] data-[highlighted]:before:shadow-[#FF5FFB40]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
