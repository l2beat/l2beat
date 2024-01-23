import React, { ReactNode } from 'react'

import { cn } from '../utils/cn'

export interface PageContentProps {
  children: ReactNode
  narrow?: boolean
  mobileFull?: boolean
  className?: string
}

export function PageContent({
  narrow,
  children,
  mobileFull = false,
  className,
}: PageContentProps) {
  return (
    <div
      className={cn(
        narrow ? 'max-w-[1064px]' : 'max-w-[1216px]',
        'mx-auto h-full leading-[1.15] md:px-12',
        !mobileFull && 'px-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
