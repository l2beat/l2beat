import cx from 'classnames'
import React from 'react'

import { InfoIcon } from '../icons'

export interface ActivityHeaderProps {
  scalingFactor: string
}

export function ActivityHeader(props: ActivityHeaderProps) {
  return (
    <header className="mt-4 md:mt-12">
      <div className="flex justify-between items-baseline">
        <h1 className="font-bold text-3xl mb-1">Activity</h1>
        <p className="font-bold text-3xl text-right">
          <span className="hidden md:inline text-sm md:text-2xl">
            Scaling factor:{' '}
          </span>
          {props.scalingFactor}
        </p>
      </div>
      <div className="flex justify-between items-baseline text-xs md:text-base">
        <p className="text-gray-500 dark:text-gray-600 hidden md:block">
          Transactions per second
        </p>
        <p
          className={cx(
            'text-gray-500 dark:text-gray-600 text-right w-full md:w-auto',
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
            <InfoIcon
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="#737373"
            />
          </span>
        </p>
      </div>
      <hr className="md:hidden mt-2 border-gray-300 dark:border-gray-850" />
    </header>
  )
}
