import { type EthereumAddress } from '@l2beat/shared-pure'
import { OutLink } from '~/components/out-link'

import OutLinkIcon from '~/icons/outlink.svg'
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

  return (
    <OutLink href={`${props.explorer}/address/${props.address.toString()}`}>
      <span className="flex items-center gap-1 text-xs">
        {formatAddress(props.address.toString())}
        <OutLinkIcon className="fill-blue-700 dark:fill-blue-500" />
      </span>
    </OutLink>
  )
}
