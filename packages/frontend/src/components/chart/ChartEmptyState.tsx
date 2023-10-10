import React from 'react'

import { Link } from '../Link'

export function ChartEmptyState() {
  return (
    //TODO: (filter) change bg to neutral-900 after merge
    <div className="absolute inset-0 -z-1 flex select-none flex-col items-center justify-center bg-gradient-to-t from-white opacity-0 transition-opacity duration-200 group-data-[state=empty]/chart:z-30 group-data-[state=empty]/chart:opacity-100 dark:from-black">
      <span className="mb-4 text-2xl font-semibold">No results</span>
      <span className="mb-6">There are no results meeting the criteria</span>
      <Link className="ProjectFilters-ResetButton cursor-pointer">
        Reset all filters
      </Link>
    </div>
  )
}
