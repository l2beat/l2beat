import React from 'react'

import { cn } from '../utils/cn'
import { PageContent } from './PageContent'

interface Props {
  children: React.ReactNode
  pageContentClassName?: string
}

export function FullPageHeader(props: Props) {
  return (
    <header className="bg-pure-white py-24 dark:bg-zinc-900">
      <PageContent
        className={cn(
          'flex items-center justify-center',
          props.pageContentClassName,
        )}
      >
        {props.children}
      </PageContent>
    </header>
  )
}
