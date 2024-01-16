import { ChainId } from '@l2beat/shared-pure'
import React, { ReactNode } from 'react'

import { getExplorerUrl } from '../../utils/getExplorerUrl'
import { Link } from '../Link'

interface EtherscanLinkProps {
  address: string
  chainId?: ChainId
  children?: ReactNode
  className?: string
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const explorerUrl = getExplorerUrl(props.chainId)
  const link = `${explorerUrl}/address/${props.address}`
  return (
    <Link href={link} className={props.className} data-role={'etherscan-link'}>
      {props.address.slice(0, 6)}…{props.address.slice(38, 42)}
      {props.children}
    </Link>
  )
}
