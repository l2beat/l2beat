import React from 'react'

import { Link } from '../Link'

export function ChartErrorState() {
  return (
    <div className="absolute inset-0 -z-1 flex select-none flex-col items-center justify-center bg-gradient-to-t from-white opacity-0 transition-opacity duration-200 group-data-[state=error]/chart:z-30 group-data-[state=error]/chart:opacity-100 dark:from-neutral-900">
      <span className="mb-4 text-2xl font-semibold">Oops!</span>
      <span className="mb-6">Something went wrong</span>
      <Link className="cursor-pointer" data-role="chart-refetch-button">
        Try again
      </Link>
    </div>
  )
}
