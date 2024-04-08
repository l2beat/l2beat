import React from 'react'

import { cn } from '../../utils/cn'
import { Checkbox } from '../Checkbox'
import { EthereumLineIcon } from '../icons/chart/EthereumLineIcon'

interface EthereumActivityToggleProps {
  showToggle: boolean
  isProjectSection: boolean
}

export function EthereumActivityToggle(props: EthereumActivityToggleProps) {
  return (
    <div className={props.showToggle ? undefined : 'hidden'}>
      <Checkbox
        role="toggle-ethereum-activity"
        id="ethereum-activity"
        className="transition-colors duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:bg-gray-200 dark:group-data-[interactivity-disabled]/chart:bg-zinc-700"
        checkIconClassName="group-data-[interactivity-disabled]/chart:opacity-0 transition-opacity duration-200"
        label={
          <span className="flex items-center gap-2 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:opacity-0">
            <EthereumLineIcon className="hidden h-1.5 w-2.5 fill-blue-500 sm:inline-block" />
            <span
              className={cn(
                'hidden',
                props.isProjectSection ? 'lg:inline' : 'md:inline',
              )}
            >
              ETH Mainnet Transactions
            </span>
            <span
              className={props.isProjectSection ? 'lg:hidden' : 'md:hidden'}
            >
              ETH Txs
            </span>
          </span>
        }
      />
    </div>
  )
}
