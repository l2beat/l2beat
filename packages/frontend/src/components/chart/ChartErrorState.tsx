import React from 'react'

import { Link } from '../Link'
import { TriangleWarningIcon } from '../icons/symbols/TriangleWarningIcon'

export function ChartErrorState() {
  return (
    <div className="-z-1 absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-gradient-to-t from-white text-center opacity-0 transition-opacity duration-200 group-data-[state=error]/chart:z-30 dark:from-neutral-900 group-data-[state=error]/chart:opacity-100">
      <TriangleWarningIcon className="fill-yellow-700 dark:fill-yellow-200" />
      <span className="font-semibold text-2xl text-yellow-700 leading-none dark:text-yellow-200">
        Whooops! Something went wrong
      </span>
      <span className="hidden text-sm xs:inline">
        We encountered an issue while loading the chart. Please try again.
      </span>
      <Link className="cursor-pointer" data-role="chart-refetch-button">
        Refresh chart
      </Link>
    </div>
  )
}
