import React from 'react'

import { Checkbox } from '../Checkbox'

interface EthereumActivityToggleProps {
  showToggle: boolean
}

export function EthereumActivityToggle(props: EthereumActivityToggleProps) {
  const className = props.showToggle ? undefined : 'hidden'
  return (
    <Checkbox
      className={className}
      role="toggle-ethereum-activity"
      id="ethereum-activity"
      text="ETH Mainnet Transaction"
      defaultChecked={props.showToggle}
    />
  )
}
