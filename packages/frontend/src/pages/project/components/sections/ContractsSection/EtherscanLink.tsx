import React, { ReactNode } from 'react'

import { Link } from '../../../../../components/Link'

interface EtherscanLinkProps {
  address: string
  truncate?: boolean
  etherscanUrl?: string
  children?: ReactNode
  className?: string
}

export function EtherscanLink({
  address,
  truncate = true,
  etherscanUrl = 'https://etherscan.io',
  children,
  className,
}: EtherscanLinkProps) {
  const link = `${etherscanUrl}/address/${address}`
  return (
    <Link href={link} className={className} data-role={'etherscan-link'}>
      {truncate ? `${address.slice(0, 6)}…${address.slice(38, 42)}` : address}
      {children}
    </Link>
  )
}
