import React, { ReactNode } from 'react'

import { WrapperProps } from '../pages/Page'
import { cn } from '../utils/cn'
import { Head } from './head'
import { FloatingBanner } from './l2warsaw/FloatingBanner'
import { TooltipProvider } from './tooltip/TooltipProvider'

export interface PageWrapperProps extends WrapperProps {
  children: ReactNode
}

export function PageWrapper(props: PageWrapperProps) {
  return (
    <html
      lang="en"
      className={cn(
        'scroll-pt-16 scroll-smooth md:scroll-pt-8',
        props.htmlClassName,
      )}
    >
      <Head {...props.metadata} preloadApi={props.preloadApi} />
      <body className={props.bodyClassName}>
        <script src="/scripts/prerender.js" />
        {props.children}
        <TooltipProvider />
        {props.banner && <FloatingBanner />}
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
