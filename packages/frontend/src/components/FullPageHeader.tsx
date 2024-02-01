import React from 'react'

import { PageContent } from './PageContent'

interface Props {
  children: React.ReactNode
}

export function FullPageHeader(props: Props) {
  return (
    <div className="bg-[#FFFFFF] px-4 py-[72px] dark:bg-zinc-900 lg:h-[700px] lg:p-0">
      <PageContent type="wider" className="flex items-center justify-center">
        {props.children}
      </PageContent>
    </div>
  )
}
