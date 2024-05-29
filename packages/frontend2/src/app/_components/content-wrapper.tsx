import React from 'react'
import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

export function ContentWrapper({ className, children }: Props) {
  return (
    <div
      className={cn('max-w-[1296px] mx-auto h-full md:px-12 px-4', className)}
    >
      {children}
    </div>
  )
}
