import React, { ReactNode } from 'react'

import { Link } from '../Link'

interface EtherscanLinkProps {
  address: string
  children?: ReactNode
  className?: string
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const link = `https://etherscan.io/address/${props.address}`
  return (
    <Link href={link} className={props.className}>
      {props.address.slice(0, 6)}…{props.address.slice(38, 42)}
      {props.children}
    </Link>
  )
}
