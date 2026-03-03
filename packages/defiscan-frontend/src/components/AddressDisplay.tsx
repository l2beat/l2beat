import { truncateAddress, etherscanUrl } from '../utils/format'

interface AddressDisplayProps {
  address: string
  className?: string
}

export function AddressDisplay({ address, className }: AddressDisplayProps) {
  return (
    <a
      href={etherscanUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-mono text-sm text-purple-600 hover:text-purple-800 transition-colors ${className ?? ''}`}
      title={address}
    >
      {truncateAddress(address)}
    </a>
  )
}
