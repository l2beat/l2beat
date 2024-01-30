import React from 'react'

import { cn } from '../utils/cn'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface OverflowWrapperProps {
  children: React.ReactNode
  disableScrollOnLoad?: boolean
  within?: 'nav-tabs'
  childrenClassName?: string
  className?: string
}

export function OverflowWrapper(props: OverflowWrapperProps) {
  return (
    <div
      data-role="overflow-wrapper"
      data-scroll-on-load={!props.disableScrollOnLoad}
      className={cn('group/overflow-wrapper relative', props.className)}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r opacity-0 transition-opacity group-data-[arrow-left-visible=true]/overflow-wrapper:pointer-events-auto group-data-[arrow-left-visible=true]/overflow-wrapper:opacity-100',
          !props.within &&
            'from-white via-white dark:from-neutral-900 dark:via-neutral-900',
          props.within === 'nav-tabs' &&
            'from-gray-100 via-gray-100 dark:from-gray-950 dark:via-gray-950',
        )}
        data-role="overflow-wrapper-arrow-left"
      >
        <div className="flex h-full items-center justify-center">
          <ChevronLeftIcon className="scale-75" />
        </div>
      </div>
      <div
        className={cn(
          'scrollbar-hide overflow-x-auto',
          props.childrenClassName,
        )}
        data-role="overflow-wrapper-content"
      >
        {props.children}
      </div>
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l opacity-0 transition-opacity group-data-[arrow-right-visible=true]/overflow-wrapper:pointer-events-auto group-data-[arrow-right-visible=true]/overflow-wrapper:opacity-100',
          !props.within &&
            'from-white via-white dark:from-neutral-900 dark:via-neutral-900',
          props.within === 'nav-tabs' &&
            'from-gray-100 via-gray-100 dark:from-gray-950 dark:via-gray-950',
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
