import type { EthereumAddress } from '@l2beat/shared-pure'
import { default as React } from 'react'

export interface EtherscanLinkProps {
  address: EthereumAddress
}

export function EtherscanLink(props: EtherscanLinkProps) {
  return (
    <a href={`https://etherscan.io/address/${props.address.toString()}`}>
      {props.address.toString()}
    </a>
  )
}
