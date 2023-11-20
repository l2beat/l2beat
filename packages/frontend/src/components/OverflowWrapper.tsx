import classNames from 'classnames'
import React from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface OverflowWrapperProps {
  children: React.ReactNode
  disableScrollOnLoad?: boolean
  className?: string
}

export function OverflowWrapper(props: OverflowWrapperProps) {
  return (
    <div
      data-role="overflow-wrapper"
      data-scroll-on-load={!props.disableScrollOnLoad}
      className={classNames('group relative', props.className)}
    >
      <div
        className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white via-white opacity-0 transition-opacity group-data-[arrow-left-visible=true]:opacity-100 dark:from-neutral-900 dark:via-neutral-900"
        data-role="overflow-wrapper-arrow-left"
      >
        <div className="flex h-full items-center justify-center">
          <ChevronLeftIcon className="scale-75" />
        </div>
      </div>
      <div
        className="scrollbar-hide overflow-x-auto"
        data-role="overflow-wrapper-content"
      >
        {props.children}
      </div>
      <div
        className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white via-white opacity-0 transition-opacity group-data-[arrow-right-visible=true]:opacity-100 dark:from-neutral-900 dark:via-neutral-900"
        data-role="overflow-wrapper-arrow-right"
      >
        <div className="flex h-full items-center justify-center">
          <ChevronRightIcon className="scale-75" />
        </div>
      </div>
    </div>
  )
}
