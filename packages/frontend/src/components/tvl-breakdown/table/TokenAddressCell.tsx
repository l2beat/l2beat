import { EthereumAddress } from '@l2beat/shared-pure'
import React from 'react'

import { formatAddress } from '../../../utils/utils'
import { OutLinkIcon } from '../../icons'

interface TokenAddressCellProps {
  address: EthereumAddress
  explorer: string
}

export function TokenAddressCell(props: TokenAddressCellProps) {
  return (
    <a
      href={`${props.explorer}/address/${props.address.toString()}`}
      target="_blank"
      className="flex gap-1 pr-2 text-xs font-medium text-blue-500 underline"
    >
      {formatAddress(props.address)}
      <OutLinkIcon className="fill-blue-500" />
    </a>
  )
}
