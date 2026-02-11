import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'

const typeToLabel = {
  nonMinting: {
    label: 'Non-minting',
    bgColor: 'bg-blue-600',
  },
  lockAndMint: {
    label: 'Lock & Mint',
    bgColor: 'bg-yellow-700',
  },
  burnAndMint: {
    label: 'Burn and Mint',
    bgColor: 'bg-teal-500',
  },
} as const

interface BridgeTypeBadgeProps {
  bridgeType: KnownInteropBridgeType
  className?: string
}

export function BridgeTypeBadge({
  bridgeType,
  className,
}: BridgeTypeBadgeProps) {
  const config = typeToLabel[bridgeType]

  return (
    <div
      key={bridgeType}
      className={cn(
        config.bgColor,
        'flex h-min w-max items-center justify-center rounded px-1.5 py-1 text-subtitle-10 text-white uppercase',
        className,
      )}
    >
      {config.label}
    </div>
  )
}
