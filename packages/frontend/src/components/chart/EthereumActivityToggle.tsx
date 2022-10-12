import React from 'react'

export function EthereumActivityToggle() {
  return (
    <label>
      <input
        data-role="toggle-ethereum-activity"
        id="ethereum-activity"
        type="checkbox"
        autoComplete="off"
      />{' '}
      <span>ETH Mainnet Transaction</span>
    </label>
  )
}
