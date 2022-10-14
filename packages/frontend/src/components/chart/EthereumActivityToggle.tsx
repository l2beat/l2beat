import cx from 'classnames'
import React from 'react'

import { Checkbox } from '../Checkbox'

interface EthereumActivityToggleProps {
  showToggle: boolean
}

export function EthereumActivityToggle(props: EthereumActivityToggleProps) {
  return (
    <Checkbox
      className={cx(!props.showToggle && 'hidden')}
      role="toggle-ethereum-activity"
      id="ethereum-activity"
      label="ETH Mainnet Transaction"
      defaultChecked={props.showToggle}
    />
  )
}
