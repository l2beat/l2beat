import React, { ReactNode } from 'react'

import { OutLink } from '../../../common'

interface EtherscanLinkProps {
  address: string
  children?: ReactNode
}

export function EtherscanLink({ address, children }: EtherscanLinkProps) {
  const link = `https://etherscan.io/address/${address}`
  return (
    <OutLink href={link} className="text-link underline">
      {address.slice(0, 6)}…{address.slice(38, 42)}
      {children}
    </OutLink>
  )
}
