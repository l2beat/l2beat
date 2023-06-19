import cx from 'classnames'
import React from 'react'

import { Checkbox } from '../Checkbox'
import { EthereumLineIcon } from '../icons/chart/EthereumLineIcon'

interface EthereumActivityToggleProps {
  showToggle: boolean
  className: string
}

export function EthereumActivityToggle(props: EthereumActivityToggleProps) {
  return (
    <Checkbox
      className={cx(!props.showToggle && 'hidden', props.className)}
      role="toggle-ethereum-activity"
      id="ethereum-activity"
      label={
        <span className="flex items-center gap-2">
          <EthereumLineIcon className="hidden h-1.5 w-2.5 fill-blue-500 sm:inline-block" />
          ETH Mainnet Transactions
        </span>
      }
    />
  )
}
