import React, { ReactNode } from 'react'

import { Link } from '../Link'

interface EtherscanLinkProps {
  address: string
  url?: string
  children?: ReactNode
  className?: string
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const explorerUrl = props.url ?? 'https://etherscan.io'
  const link = `${explorerUrl}/address/${props.address}`
  return (
    <Link href={link} className={props.className} data-role={'etherscan-link'}>
      {props.address.slice(0, 6)}…{props.address.slice(38, 42)}
      {props.children}
    </Link>
  )
}
