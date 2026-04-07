import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { cn } from '~/utils/cn'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '../../utils/display'

interface BridgeTypeBadgeProps {
  bridgeType: KnownInteropBridgeType
  className?: string
}

export function BridgeTypeBadge({
  bridgeType,
  className,
}: BridgeTypeBadgeProps) {
  const config = TRANSFER_TYPE_DISPLAY[bridgeType]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          key={bridgeType}
          className={cn(
            INTEROP_TYPE_TO_BG_COLOR[bridgeType],
            'flex h-min w-max cursor-pointer items-center justify-center whitespace-nowrap rounded px-1.5 py-1 text-subtitle-10 text-white uppercase',
            className,
          )}
        >
          {config.label}
        </div>
      </TooltipTrigger>
      <TooltipContent>{config.description}</TooltipContent>
    </Tooltip>
  )
}
