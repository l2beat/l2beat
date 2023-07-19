import classNames from 'classnames'
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
    <html
      lang="en"
      className={classNames(
        'scroll-pt-16 scroll-smooth md:scroll-pt-8',
        props.htmlClassName,
      )}
    >
      <Head {...props.metadata} preloadApi={props.preloadApi} />
      <body className="bg-white text-black dark:bg-black dark:text-white">
        {props.children}
        <Tooltip />
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
