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
  disabledOnTouch,
}: {
  share: LiquidStakingStakedEthShare
  className?: string
  /** In a table row, a tap follows the row's link instead. */
  disabledOnTouch?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        disabledOnTouch={disabledOnTouch}
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
