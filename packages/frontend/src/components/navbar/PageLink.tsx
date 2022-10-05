import cx from 'classnames'
import React, { ReactNode } from 'react'

export interface PageLinkProps {
  large?: boolean
  selected?: boolean
  href: string
  children: ReactNode
}

export function PageLink(props: PageLinkProps) {
  return (
    <a
      className={cx(
        'flex items-center h-full font-medium',
        props.large ? 'text-base md:text-lg px-2 md:px-4' : 'px-2',
        props.selected &&
          'pt-0.5 text-pink-900 dark:text-pink-100 border-current border-b-2',
      )}
      href={props.href}
    >
      {props.children}
    </a>
  )
}
