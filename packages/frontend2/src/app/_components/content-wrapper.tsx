import React from 'react'
import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'main'
}

export function ContentWrapper({ className, children, as = 'div' }: Props) {
  const Comp = as
  return (
    <Comp
      className={cn('max-w-[1296px] mx-auto h-full md:px-12 px-4', className)}
    >
      {children}
    </Comp>
  )
}
