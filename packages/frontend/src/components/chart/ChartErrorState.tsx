import React from 'react'

import { TriangleWarningIcon } from '../icons/symbols/TriangleWarningIcon'
import { Link } from '../Link'

export function ChartErrorState() {
  return (
    <div className="absolute inset-0 -z-1 flex select-none flex-col items-center justify-center gap-4 bg-gradient-to-t from-white text-center opacity-0 transition-opacity duration-200 group-data-[state=error]/chart:z-30 group-data-[state=error]/chart:opacity-100 dark:from-neutral-900">
      <TriangleWarningIcon className="fill-yellow-700 dark:fill-yellow-200" />
      <span className="text-2xl font-semibold leading-none text-yellow-700 dark:text-yellow-200">
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
