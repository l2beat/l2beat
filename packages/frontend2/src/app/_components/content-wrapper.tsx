import { Slot } from '@radix-ui/react-slot'
import React from 'react'
import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  mobileFull?: boolean
}

export function ContentWrapper({
  className,
  children,
  asChild,
  mobileFull = false,
}: Props) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      className={cn(
        'mx-auto h-full max-w-[1296px] md:px-12',
        !mobileFull && 'px-4',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
