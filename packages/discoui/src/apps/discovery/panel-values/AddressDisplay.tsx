import type { AddressFieldValue } from '../../../api/types'
import { AddressIcon } from '../../../components/AddressIcon'
import { EXPLORER_URLS } from '../../../config/explorers'
import { useCopy } from '../../../hooks/useCopy'
import { IconCopy } from '../../../icons/IconCopy'
import { IconLink } from '../../../icons/IconLink'
import { IconTick } from '../../../icons/IconTick'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { usePanelStore } from '../store/panel-store'

export interface AddressDisplayProps {
  value: AddressFieldValue
  simplified?: boolean
}

export function AddressDisplay({ value, simplified }: AddressDisplayProps) {
  const select = usePanelStore((state) => state.select)
  const [chain, address] = value.address.split(':')

  const { copied, copy: copyToClipboard } = useCopy()

  const copy = (
    <button
      className="block h-4 w-4 text-coffee-400 hover:text-coffee-200"
      onClick={(e) => {
        e.preventDefault()
        copyToClipboard(address ?? value.address)
      }}
    >
      {!copied && <IconCopy className="relative top-[3px] block" />}
      {copied && (
        <IconTick className="relative top-[3px] block text-aux-green" />
      )}
    </button>
  )

  const explorerUrl = EXPLORER_URLS[chain ?? '']
  const explore = explorerUrl && (
    <a
      href={`${explorerUrl}/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-coffee-400 hover:text-coffee-200"
    >
      <IconLink className="relative top-[3px] block" />
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
          onClick={() => select([value.address])}
        >
          <AddressIcon
            className="relative top-[3px] block"
            type={value.addressType}
          />
          <span className="font-medium font-sans text-[13px]">
            {value.name ?? (value.addressType === 'EOA' ? 'EOA' : 'Unknown')}
          </span>
          <span className="text-coffee-300">
            {toShortenedAddress(value.address)}
          </span>
        </button>
        {copy}
        {explore}
      </p>
    )
  }
  return (
    <p className="inline-flex items-baseline gap-1 whitespace-nowrap font-mono text-coffee-400 text-xs">
      <strong>{value.name ?? 'Unknown'}</strong>
      {toShortenedAddress(value.address)}
      {copy}
      {explore}
    </p>
  )
}
