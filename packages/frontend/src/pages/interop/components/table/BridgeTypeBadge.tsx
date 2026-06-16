import type { InteropBridgeType } from '@l2beat/shared-pure'
import { Badge, type BadgeProps } from '~/components/badge/Badge'
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

interface BridgeTypeBadgeProps extends Omit<BadgeProps, 'children'> {
  bridgeType: InteropBridgeType
}

export function BridgeTypeBadge({
  bridgeType,
  className,
  padding,
  size,
  type,
}: BridgeTypeBadgeProps) {
  const config = TRANSFER_TYPE_DISPLAY[bridgeType]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          className={cn(
            INTEROP_TYPE_TO_BG_COLOR[bridgeType],
            'cursor-pointer whitespace-nowrap text-white uppercase',
            className,
          )}
          padding={padding}
          size={size}
          type={type}
        >
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{config.description}</TooltipContent>
    </Tooltip>
  )
}
