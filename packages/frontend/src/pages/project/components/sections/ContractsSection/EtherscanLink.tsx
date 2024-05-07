import React, { ReactNode } from 'react'

import { Link } from '../../../../../components/Link'

interface EtherscanLinkProps {
  address: string
  etherscanUrl?: string
  children?: ReactNode
  className?: string
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const url = props.etherscanUrl ?? 'https://etherscan.io'
  const link = `${url}/address/${props.address}`
  return (
    <Link href={link} className={props.className} data-role={'etherscan-link'}>
      {props.address.slice(0, 6)}…{props.address.slice(38, 42)}
      {props.children}
    </Link>
  )
}
