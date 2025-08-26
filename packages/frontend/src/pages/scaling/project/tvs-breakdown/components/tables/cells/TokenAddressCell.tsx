import { CustomLink } from '~/components/link/CustomLink'

import { CustomLinkIcon } from '~/icons/Outlink'
import { formatAddress } from '~/utils/formatAddress'

interface Props {
  address: string
  name?: string
  url?: string
}

export function TokenAddressCell(props: Props) {
  const label = props.name ?? formatAddress(props.address.toString())
  if (!props.url) {
    return <span className="pr-2 font-medium text-xs">{label}</span>
  }

  return (
    <CustomLink href={props.url}>
      <span className="flex items-center gap-1 text-xs">
        {label}
        <CustomLinkIcon className="fill-blue-700 dark:fill-blue-500" />
      </span>
    </CustomLink>
  )
}
