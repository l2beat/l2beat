import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { PercentChange } from '../PercentChange'

export interface TvlHeaderProps {
  tvl: string
  tvlWeeklyChange: string
}

export function TvlHeader(props: TvlHeaderProps) {
  return (
    <header className="mt-4 flex flex-col justify-between text-base md:mt-12 md:flex-row">
      <div>
        <h1 className="mb-1 text-3xl font-bold">Total Value Locked</h1>
        <p className="hidden text-gray-500 dark:text-gray-600 md:block">
          Sum of all funds locked on Ethereum converted to USD
        </p>
      </div>
      <div className="flex flex-row items-baseline gap-2 md:flex-col md:items-end md:gap-1">
        <p className="text-right text-lg font-bold md:text-3xl">{props.tvl}</p>
        <p className="text-right text-xs font-bold md:text-base">
          <PercentChange value={props.tvlWeeklyChange} /> / 7 days
        </p>
      </div>
      <HorizontalSeparator className="mt-2 md:hidden" />
    </header>
  )
}
