import React, { ReactNode } from 'react'

import { PageMetadata } from '../pages/Page'
import { Tooltip } from './Tooltip'
import { Head } from './head'

export interface PageWrapperProps {
  htmlClassName?: string
  metadata: PageMetadata
  preloadApi?: string
  children: ReactNode
}

export function PageWrapper(props: PageWrapperProps) {
  return (
    <html lang="en" className={props.htmlClassName}>
      <Head {...props.metadata} preloadApi={props.preloadApi} />
      <body className="bg-white text-black dark:bg-black dark:text-white">
        {props.children}
        <Tooltip />
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
