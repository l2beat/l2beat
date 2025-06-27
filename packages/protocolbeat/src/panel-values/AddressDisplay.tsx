import type { AddressFieldValue } from '../api/types'
import { AddressIcon } from '../common/AddressIcon'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { Copy } from '../components/Copy'
import { IconLink } from '../icons/IconLink'
import { usePanelStore } from '../store/store'
import { EXPLORER_URLS } from './explorers'

export interface AddressDisplayProps {
  value: AddressFieldValue
  simplified?: boolean
}

export function AddressDisplay({ value, simplified }: AddressDisplayProps) {
  const select = usePanelStore((state) => state.select)
  const [chain, address] = value.address.split(':')

  const copy = <Copy value={value.address} timeoutMs={1000} />

  const explorerUrl = EXPLORER_URLS[chain ?? '']
  const explore = explorerUrl && (
    <a
      href={`${explorerUrl}/${address}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconLink className="relative top-[3px] block text-coffee-600" />
    </a>
  )

  if (simplified) {
    return (
      <p className="inline-flex items-baseline gap-1 whitespace-nowrap font-mono text-xs">
        {value.address}
        {copy}
        {explore}
      </p>
    )
  }

  if (value.addressType !== 'Unknown') {
    return (
      <p className="inline-flex w-min items-baseline gap-1 whitespace-nowrap text-left font-mono text-xs">
        <button
          className="inline-flex items-baseline gap-1 text-aux-blue"
          onClick={() => select(value.address)}
        >
          <AddressIcon
            className="relative top-[3px] block"
            type={value.addressType}
          />
          <strong>
            {value.name ?? (value.addressType === 'EOA' ? 'EOA' : 'Unknown')}
          </strong>
          {toShortenedAddress(value.address)}
        </button>
        {copy}
        {explore}
      </p>
    )
  } else {
    return (
      <p className="inline-flex items-baseline gap-1 whitespace-nowrap font-mono text-coffee-400 text-xs">
        <strong>{value.name ?? 'Unknown'}</strong>
        {toShortenedAddress(value.address)}
        {copy}
        {explore}
      </p>
    )
  }
}
