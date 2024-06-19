import React from 'react'
import { cn } from '~/utils/cn'
import { HorizontalSeparator } from './horizontal-separator'

interface PageHeaderProps {
  children: string
  className?: string
}

export function SimplePageHeader({ children, className }: PageHeaderProps) {
  return (
    <header className={cn('mt-4 md:mt-12', className)}>
      <h1 className="mb-1 font-bold text-3xl">{children}</h1>
      <HorizontalSeparator className="mt-2 md:hidden" />
    </header>
  )
}
