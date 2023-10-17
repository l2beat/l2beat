import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'

export function TvlHeader() {
  return (
    <header
      className="mb-4 flex flex-col justify-between text-base md:flex-row"
      data-role="chart-header"
    >
      <div>
        <h1 className="mb-1 text-3xl font-bold">Value Locked</h1>
        <p className="hidden text-gray-500 dark:text-gray-600 md:block">
          Sum of all funds locked on Ethereum converted to{' '}
          <span data-role="chart-header-currency">...</span>
        </p>
      </div>
      <div className="flex flex-row items-baseline gap-2 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0 md:flex-col md:items-end md:gap-1">
        <p
          className="text-right text-lg font-bold md:text-3xl"
          data-role="chart-header-value"
        >
          ...
        </p>
        <p className="text-right text-xs font-bold md:text-base">
          <span data-role="chart-header-value-change">...</span> / 7 days
        </p>
      </div>
      <HorizontalSeparator className="mt-2 md:hidden" />
    </header>
  )
}
