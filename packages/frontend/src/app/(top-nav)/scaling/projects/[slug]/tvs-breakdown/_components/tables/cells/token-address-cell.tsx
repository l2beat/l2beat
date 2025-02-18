import type { EthereumAddress } from '@l2beat/shared-pure'
import { CustomLink } from '~/components/link/custom-link'

import { CustomLinkIcon } from '~/icons/outlink'
import { formatAddress } from '~/utils/format-address'

interface Props {
  address: EthereumAddress
  url?: string
}

export function TokenAddressCell(props: Props) {
  if (!props.url) {
    return (
      <span className="pr-2 text-xs font-medium">
        {formatAddress(props.address.toString())}
      </span>
    )
  }

  return (
    <CustomLink href={props.url}>
      <span className="flex items-center gap-1 text-xs">
        {formatAddress(props.address.toString())}
        <CustomLinkIcon className="fill-blue-700 dark:fill-blue-500" />
      </span>
    </CustomLink>
  )
}
