import React, { ReactNode } from 'react'

import { Link } from '../Link'

interface EtherscanLinkProps {
  address: string
  children?: ReactNode
  className?: string
  fullAddress?: boolean
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const link = `https://etherscan.io/address/${props.address}`
  return (
    <Link href={link} className={props.className}>
      {displayAddress(props.address, props.fullAddress)}
      {props.children}
    </Link>
  )
}

function displayAddress(address: string, fullAddress?: boolean) {
  if (fullAddress) {
    return address
  }
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`
}
