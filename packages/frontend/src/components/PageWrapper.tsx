import React, { ReactNode } from 'react'

import { WrapperProps } from '../pages/Page'
import { cn } from '../utils/cn'
import { FloatingBanner } from './gitcoin/FloatingBanner'
import { Head } from './head'
import { TooltipProvider } from './tooltip/TooltipProvider'

export interface PageWrapperProps extends WrapperProps {
  htmlClassName?: string
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
      <Head {...props.metadata} preloadApis={props.preloadApis} />
      <body className="flex flex-col min-h-screen">
        <script src="/scripts/prerender.js" />
        {props.children}
        <TooltipProvider />
        {props.banner && <FloatingBanner />}
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
