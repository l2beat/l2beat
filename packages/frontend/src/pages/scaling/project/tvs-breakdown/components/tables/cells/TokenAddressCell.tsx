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
    return <span className="pr-2 font-medium text-label-value-14">{label}</span>
  }

  return (
    <CustomLink href={props.url} className="inline-block leading-0">
      <span className="flex items-center gap-1 text-label-value-14">
        {label}
        <CustomLinkIcon className="size-3.5 fill-blue-700 dark:fill-blue-500" />
      </span>
    </CustomLink>
  )
}
