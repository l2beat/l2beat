import React from 'react'

import { cn } from '../utils/cn'
import { PageContent } from './PageContent'

interface Props {
  children: React.ReactNode
  pageContentClassName?: string
}

export function FullPageHeader(props: Props) {
  return (
    <div className="bg-[#FFFFFF] px-4 py-[72px] dark:bg-zinc-900 lg:h-[700px] lg:p-0">
      <PageContent
        type="wider"
        className={cn(
          'flex items-center justify-center',
          props.pageContentClassName,
        )}
      >
        {props.children}
      </PageContent>
    </div>
  )
}
