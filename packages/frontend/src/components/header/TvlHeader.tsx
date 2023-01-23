import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { PercentChange } from '../PercentChange'

export interface TvlHeaderProps {
  tvl: string
  tvlWeeklyChange: string
}

export function TvlHeader(props: TvlHeaderProps) {
  return (
    <header className="mt-4 md:mt-12 flex justify-between flex-col md:flex-row text-base">
      <div>
        <h1 className="font-bold text-3xl mb-1">Total Value Locked</h1>
        <p className="text-gray-500 dark:text-gray-600 hidden md:block">
          Sum of all funds locked on Ethereum converted to USD
        </p>
      </div>
      <div className="flex flex-row md:flex-col gap-2 md:gap-1 items-baseline md:items-end">
        <p className="font-bold text-lg md:text-3xl text-right">{props.tvl}</p>
        <p className="font-bold text-xs md:text-base text-right">
          <PercentChange value={props.tvlWeeklyChange} /> / 7 days
        </p>
      </div>
      <HorizontalSeparator className="md:hidden mt-2" />
    </header>
  )
}
