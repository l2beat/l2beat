import React from 'react'

interface EthereumActivityToggleProps {
  showToggle: boolean
}

export function EthereumActivityToggle(props: EthereumActivityToggleProps) {
  const className = props.showToggle ? undefined : 'hidden'
  return (
    <label className={className}>
      <input
        data-role="toggle-ethereum-activity"
        id="ethereum-activity"
        type="checkbox"
        autoComplete="off"
        defaultChecked={props.showToggle}
      />{' '}
      <span>ETH Mainnet Transaction</span>
    </label>
  )
}
