import React from 'react'
import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'main'
  mobileFull?: boolean
}

export function ContentWrapper({
  className,
  children,
  as = 'div',
  mobileFull = false,
}: Props) {
  const Comp = as
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
