import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { LiquidStakingStakedEthShare } from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import {
  formatStakedEthShare,
  STAKED_ETH_SHARE_TOOLTIP,
} from '../liquidStakingMetrics'

/** The line under a TVL, e.g. "(24.1% of staked ETH)". */
export function StakedEthShare({
  share,
  className,
}: {
  share: LiquidStakingStakedEthShare
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        disabledOnTouch
        className={cn('whitespace-nowrap text-secondary', className)}
      >
        ({formatStakedEthShare(share.value)})
      </TooltipTrigger>
      <TooltipContent>
        {STAKED_ETH_SHARE_TOOLTIP} ETH staked as of{' '}
        {formatTimestamp(share.timestamp, { mode: 'date' })}.
      </TooltipContent>
    </Tooltip>
  )
}
