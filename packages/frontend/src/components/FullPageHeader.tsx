import React from 'react'

import { cn } from '../utils/cn'
import { PageContent } from './PageContent'

interface Props<T extends React.ElementType> {
  children: React.ReactNode
  className?: string
  pageContentClassName?: string
  as?: T
}

export function FullPageHeader<T extends React.ElementType>(props: Props<T>) {
  const Comp = props.as ?? 'header'
  return (
    <Comp
      className={cn('bg-pure-white py-24 dark:bg-zinc-900', props.className)}
    >
      <PageContent
        className={cn(
          'flex items-center justify-center',
          props.pageContentClassName,
        )}
      >
        {props.children}
      </PageContent>
    </Comp>
  )
}
