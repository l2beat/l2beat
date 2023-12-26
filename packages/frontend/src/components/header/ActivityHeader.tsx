import cx from 'classnames'
import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { InfoIcon } from '../icons'

export function ActivityHeader() {
  return (
    <header className="mb-4" data-role="chart-header">
      <div className="flex items-baseline justify-between">
        <h1 className="mb-1 text-3xl font-bold">Activity</h1>
        <p className="text-right text-3xl font-bold group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0">
          <span className="hidden text-sm md:inline md:text-2xl">
            Scaling factor:{' '}
          </span>
          <span data-role="chart-header-value">...</span>
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
            'group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0',
          )}
        >
          Observed over the last 7 days
          <span
            className="Tooltip inline-block"
            title={
              'How many more transactions are settled by Ethereum if we take into account projects listed below.' +
              '\n' +
              'Exact formula:' +
              '\n' +
              '(project txs/7d + ETH txs/7d) / ETH txs/7d'
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
