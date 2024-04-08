import React from 'react'

import { cn } from '../utils/cn'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface OverflowWrapperProps {
  children: React.ReactNode
  disableScrollOnLoad?: boolean
  within?: 'nav-tabs' | 'full-page-header'
  childrenClassName?: string
  className?: string
}

export function OverflowWrapper({
  children,
  disableScrollOnLoad,
  within,
  childrenClassName,
  className,
  ...rest
}: OverflowWrapperProps) {
  return (
    <div
      data-role="overflow-wrapper"
      data-scroll-on-load={!disableScrollOnLoad}
      className={cn('group/overflow-wrapper relative', className)}
      {...rest}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r opacity-0 transition-opacity group-data-[arrow-left-visible=true]/overflow-wrapper:pointer-events-auto group-data-[arrow-left-visible=true]/overflow-wrapper:opacity-100',
          !within &&
            'from-white via-white dark:from-neutral-900 dark:via-neutral-900',
          within === 'nav-tabs' &&
            'from-gray-100 via-gray-100 dark:from-gray-950 dark:via-gray-950',
          within === 'full-page-header' &&
            'from-pure-white via-pure-white dark:from-zinc-900 dark:via-zinc-900',
        )}
        data-role="overflow-wrapper-arrow-left"
      >
        <div className="flex h-full items-center justify-center">
          <ChevronLeftIcon className="scale-75" />
        </div>
      </div>
      <div
        className={cn('scrollbar-hide overflow-x-auto', childrenClassName)}
        data-role="overflow-wrapper-content"
      >
        {children}
      </div>
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l opacity-0 transition-opacity group-data-[arrow-right-visible=true]/overflow-wrapper:pointer-events-auto group-data-[arrow-right-visible=true]/overflow-wrapper:opacity-100',
          !within &&
            'from-white via-white dark:from-neutral-900 dark:via-neutral-900',
          within === 'nav-tabs' &&
            'from-gray-100 via-gray-100 dark:from-gray-950 dark:via-gray-950',
          within === 'full-page-header' &&
            'from-pure-white via-pure-white dark:from-zinc-900 dark:via-zinc-900',
        )}
        data-role="overflow-wrapper-arrow-right"
      >
        <div className="flex h-full items-center justify-center">
          <ChevronRightIcon className="scale-75" />
        </div>
      </div>
    </div>
  )
}
