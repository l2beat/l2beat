import React, { ReactNode } from 'react'

export interface PageContentProps {
  children: ReactNode
}

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="max-w-[1216px] h-full px-4 md:px-12 mx-auto leading-[1.15]">
      {children}
    </div>
  )
}
