import React from 'react'

export interface ActivityHeaderProps {
  scalingFactor: string
}

export function ActivityHeader(props: ActivityHeaderProps) {
  return (
    <header className="mb-4 md:mb-12">
      <div className="flex justify-between items-baseline">
        <h1 className="font-bold text-3xl mb-1">Activity</h1>
        <p className="font-bold text-3xl text-right">
          <span className="hidden md:inline text-sm md:text-2xl">
            Speedup factor:{' '}
          </span>
          {props.scalingFactor}
        </p>
      </div>
      <div className="flex justify-between items-baseline">
        <p className="text-gray-700 hidden md:block">Transactions per second</p>
        <p className="text-gray-700 text-xs md:text-base text-right w-full md:w-auto">
          More txs on Ethereum because of L2s
        </p>
      </div>
      <hr className="md:hidden mt-2 border-gray-300 dark:border-gray-850" />
    </header>
  )
}
