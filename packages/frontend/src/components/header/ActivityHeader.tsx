import cx from 'classnames'
import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { InfoIcon } from '../icons'

export interface ActivityHeaderProps {
  scalingFactor: string
}

export function ActivityHeader(props: ActivityHeaderProps) {
  return (
    <header className="mt-4 md:mt-12">
      <div className="flex items-baseline justify-between">
        <h1 className="mb-1 text-3xl font-bold">Activity</h1>
        <p className="text-right text-3xl font-bold">
          <span className="hidden text-sm md:inline md:text-2xl">
            Scaling factor:{' '}
          </span>
          {props.scalingFactor}
        </p>
      </div>
      <div className="flex items-baseline justify-between text-xs md:text-base">
        <p className="hidden text-gray-500 dark:text-gray-600 md:block">
          Transactions per second
        </p>
        <p
          className={cx(
            'w-full text-right text-gray-500 dark:text-gray-600 md:w-auto',
            'flex items-center gap-1.5',
          )}
        >
          Observed over the last 7 days
          <span
            className="Tooltip inline-block"
            title={
              'How many more transactions are settled by Ethereum if we take into account the L2 solutions.' +
              '\n' +
              'Exact formula:' +
              '\n' +
              '(L2 txs/7d + ETH txs/7d) / ETH txs/7d'
            }
          >
            <InfoIcon />
          </span>
        </p>
      </div>
      <HorizontalSeparator className="mt-2 md:hidden" />
    </header>
  )
}
