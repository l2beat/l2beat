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
      className={cn('mx-auto h-full max-w-[1296px] px-4 md:px-12', className)}
    >
      {children}
    </Comp>
  )
}
