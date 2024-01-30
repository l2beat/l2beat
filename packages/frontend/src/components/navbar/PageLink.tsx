import React, { ReactNode } from 'react'

import { cn } from '../../utils/cn'

export interface PageLinkProps {
  href: string
  children: ReactNode
  selected?: boolean
  newTab?: boolean
  large?: boolean
}

export function PageLink(props: PageLinkProps) {
  return (
    <a
      className={cn(
        'flex h-full items-center font-medium',
        props.large ? 'px-2 text-base md:px-4 md:text-lg' : 'px-2',
        props.selected &&
          'border-b-2 border-current pt-0.5 text-pink-900 dark:text-pink-200',
      )}
      href={props.href}
      target={props.newTab ? '_blank' : undefined}
    >
      {props.children}
    </a>
  )
}
