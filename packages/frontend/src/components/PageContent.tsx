import React, { ReactNode } from 'react'

import { cn } from '../utils/cn'

export interface PageContentProps {
  children: ReactNode
  type?: 'subpage' | 'article'
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
        'max-w-[1256px]',
        type === 'subpage' && 'max-w-[1296px]',
        type === 'article' && 'max-w-[816px]',
        'mx-auto h-full leading-[1.15] md:px-12',
        !mobileFull && 'px-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
