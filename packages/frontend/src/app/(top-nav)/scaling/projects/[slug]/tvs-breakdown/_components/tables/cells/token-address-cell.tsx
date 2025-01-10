import { type EthereumAddress } from '@l2beat/shared-pure'
import { CustomLink } from '~/components/link/custom-link'

import { CustomLinkIcon } from '~/icons/outlink'
import { formatAddress } from '~/utils/format-address'

interface Props {
  address: EthereumAddress
  explorer?: string
}

export function TokenAddressCell(props: Props) {
  if (!props.explorer) {
    return (
      <span className="pr-2 text-xs font-medium">
        {formatAddress(props.address.toString())}
      </span>
    )
  }

  const explorerUrl = props.explorer.endsWith('/')
    ? props.explorer.slice(0, -1)
    : props.explorer

  return (
    <CustomLink href={`${explorerUrl}/address/${props.address.toString()}`}>
      <span className="flex items-center gap-1 text-xs">
        {formatAddress(props.address.toString())}
        <CustomLinkIcon className="fill-blue-700 dark:fill-blue-500" />
      </span>
    </CustomLink>
  )
}
