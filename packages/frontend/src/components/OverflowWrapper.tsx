import React from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from './icons'

export function OverflowWrapper(props: { children: React.ReactNode }) {
  return (
    <div data-role="overflow-wrapper" className="group relative">
      <div
        className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white via-white opacity-0 transition-opacity group-data-[arrow-left-visible=true]:opacity-100 dark:from-gray-950 dark:via-gray-950"
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
        className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white via-white opacity-0 transition-opacity group-data-[arrow-right-visible=true]:opacity-100 dark:from-gray-950 dark:via-gray-950"
        data-role="overflow-wrapper-arrow-right"
      >
        <div className="flex h-full items-center justify-center">
          <ChevronRightIcon className="scale-75" />
        </div>
      </div>
    </div>
  )
}
