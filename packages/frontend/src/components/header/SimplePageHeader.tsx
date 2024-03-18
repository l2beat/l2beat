import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'

interface PageHeaderProps {
  children: string
}

export function SimplePageHeader({ children }: PageHeaderProps) {
  return (
    <header className="mt-4 md:mt-12">
      <h1 className="mb-1 text-3xl font-bold">{children}</h1>
      <HorizontalSeparator className="mt-2 md:hidden" />
    </header>
  )
}
