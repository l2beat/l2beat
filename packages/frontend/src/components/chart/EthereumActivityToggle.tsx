import React from 'react'

import { Checkbox } from '../Checkbox'
import { EthereumLineIcon } from '../icons/chart/EthereumLineIcon'

interface EthereumActivityToggleProps {
  showToggle: boolean
  className: string
}

export function EthereumActivityToggle(props: EthereumActivityToggleProps) {
  return (
    <div data-activity-only className={props.showToggle ? undefined : 'hidden'}>
      <Checkbox
        className={props.className}
        role="toggle-ethereum-activity"
        id="ethereum-activity"
        label={
          <span className="flex items-center gap-2">
            <EthereumLineIcon className="hidden h-1.5 w-2.5 fill-blue-500 sm:inline-block" />
            <span className="hidden md:inline">ETH Mainnet Transactions</span>
            <span className="md:hidden">ETH Txs</span>
          </span>
        }
      />
    </div>
  )
}
