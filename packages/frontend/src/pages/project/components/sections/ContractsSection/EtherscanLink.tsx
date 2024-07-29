import React from 'react'

import { Link, LinkProps } from '../../../../../components/Link'

interface EtherscanLinkProps {
  address: string
  truncate?: boolean
  etherscanUrl?: string
  children?: React.ReactNode
  className?: string
  type?: LinkProps['type']
}

export function EtherscanLink({
  address,
  truncate = true,
  etherscanUrl = 'https://etherscan.io',
  type,
  children,
  className,
}: EtherscanLinkProps) {
  const link = `${etherscanUrl}/address/${address}`
  return (
    <Link
      href={link}
      className={className}
      data-role="etherscan-link"
      type={type}
    >
      {children}
      {truncate ? `${address.slice(0, 6)}…${address.slice(38, 42)}` : address}
    </Link>
  )
}
