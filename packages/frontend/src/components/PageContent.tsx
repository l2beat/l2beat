import React, { ReactNode } from 'react'

import { cn } from '../utils/cn'

export interface PageContentProps {
  children: ReactNode
  type?: 'narrow' | 'wider'
  mobileFull?: boolean
  className?: string
}

export function PageContent({
  type,
  children,
  mobileFull = false,
  className,
}: PageContentProps) {
  return (
    <div
      className={cn(
        'max-w-[1216px]',
        type === 'narrow' && 'max-w-[1064px]',
        type === 'wider' && 'max-w-[1296px]',
        'mx-auto h-full leading-[1.15] md:px-12',
        !mobileFull && 'px-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
