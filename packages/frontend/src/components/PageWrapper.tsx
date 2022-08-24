import React, { ReactNode } from 'react'

import { PageMetadata } from '../pages/Page'
import { Head } from './head'
import { Tooltip } from './Tooltip'

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
      <body>
        {props.children}
        <Tooltip />
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
