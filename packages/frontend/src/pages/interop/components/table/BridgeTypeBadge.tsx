import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { cn } from '~/utils/cn'
import { interopDescriptions } from '../../descriptions'

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
    label: 'Burn & Mint',
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
  const description = interopDescriptions[bridgeType]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          key={bridgeType}
          className={cn(
            config.bgColor,
            'flex h-min w-max cursor-pointer items-center justify-center rounded px-1.5 py-1 text-subtitle-10 text-white uppercase',
            className,
          )}
        >
          {config.label}
        </div>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}
