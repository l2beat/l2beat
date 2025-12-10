import { Slot } from '@radix-ui/react-slot'
import React from 'react'
import { cn } from '~/utils/cn'

export function CardActionButtons({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 right-0 flex overflow-hidden rounded-bl-xl border-divider border-b border-l">
      {children}
    </div>
  )
}

export function CardActionButton({
  children,
  className,
  asChild = false,
  ...props
}: {
  children: React.ReactNode
  asChild?: boolean
} & React.ComponentProps<'button'>) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      type="button"
      className={cn(
        'flex size-8 items-center justify-center not-disabled:hover:bg-accent disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
