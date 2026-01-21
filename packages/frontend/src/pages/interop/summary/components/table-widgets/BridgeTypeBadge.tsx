import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
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
  omnichain: {
    label: 'Omnichain',
    bgColor: 'bg-teal-500',
  },
} as const

interface BridgeTypeBadgeProps {
  bridgeType: ProtocolEntry['bridgeType']
  className?: string
}

export function BridgeTypeBadge({
  bridgeType,
  className,
}: BridgeTypeBadgeProps) {
  const config = typeToLabel[bridgeType]

  return (
    <div
      className={cn(
        config.bgColor,
        'w-max rounded px-1.5 py-1 text-subtitle-10 text-white uppercase',
        className,
      )}
    >
      {config.label}
    </div>
  )
}
