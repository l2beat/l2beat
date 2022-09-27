import React, { ReactNode } from 'react'

export interface PageContentProps {
  children: ReactNode
}

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="max-w-[1000px] h-full px-4 mx-auto leading-[1.15]">
      {children}
    </div>
  )
}
