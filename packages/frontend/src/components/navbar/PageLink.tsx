import classNames from 'classnames'
import React, { ReactNode } from 'react'

export interface PageLinkProps {
  large?: boolean
  selected?: boolean
  href: string
  children: ReactNode
}

export function PageLink(props: PageLinkProps) {
  const className = classNames(
    props.large ? 'text-base md:text-lg px-2 md:px-4' : 'px-2',
    'flex items-center h-full',
    props.selected &&
      'pt-0.5 text-pink-900 dark:text-pink-100 border-current border-b-2',
  )

  return (
    <a className={className} href={props.href}>
      {props.children}
    </a>
  )
}
