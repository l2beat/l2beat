import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { WrapperProps } from '../pages/Page'
import { Head } from './head'
import { FloatingBanner } from './l2warsaw/FloatingBanner'
import { Tooltip } from './Tooltip'

export interface PageWrapperProps extends WrapperProps {
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
      <body className="bg-white text-black dark:bg-neutral-900 dark:text-white">
        {props.children}
        <Tooltip />
        {props.banner && <FloatingBanner />}
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
