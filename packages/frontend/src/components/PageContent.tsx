import classNames from 'classnames'
import React, { ReactNode } from 'react'

export interface PageContentProps {
  children: ReactNode
  narrow?: boolean
}

export function PageContent({ narrow, children }: PageContentProps) {
  return (
    <div
      className={classNames(
        narrow ? 'max-w-[1064px]' : 'max-w-[1216px]',
        'h-full px-4 md:px-12 mx-auto leading-[1.15]',
      )}
    >
      {children}
    </div>
  )
}
