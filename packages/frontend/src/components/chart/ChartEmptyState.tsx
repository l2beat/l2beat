import React from 'react'

import { EmptyStateIcon } from '../icons/symbols/EmptyStateIcon'

export function ChartEmptyState() {
  return (
    <div className="-z-1 absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-gradient-to-t from-white text-center opacity-0 transition-opacity duration-200 group-data-[state=empty]/chart:z-30 dark:from-neutral-900 group-data-[state=empty]/chart:opacity-100">
      <EmptyStateIcon className="fill-yellow-700 dark:fill-yellow-200" />
      <span className="font-semibold text-2xl text-yellow-700 leading-none dark:text-yellow-200">
        No results
      </span>
      <span className="text-sm">There are no results meeting the criteria</span>
    </div>
  )
}
