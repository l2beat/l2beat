import { NoDataBadge } from '~/components/badge/no-data-badge'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/components/breakdown/token-breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { type ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'

interface Props {
  breakdown:
    | NonNullable<ScalingProjectEntry['header']['tvl']>['tokenBreakdown']
    | undefined
}

export function TokenBreakdownStat({ breakdown }: Props) {
  if (!breakdown) {
    return <NoDataBadge />
  }
  const { total, associated, ether, stablecoin, associatedTokens, warnings } =
    breakdown

  const isAnyWarningBad = warnings.some((w) => w.sentiment === 'bad')

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <TokenBreakdown
          total={total}
          associated={associated}
          ether={ether}
          stablecoin={stablecoin}
        />
        {warnings.length > 0 && (
          <RoundedWarningIcon sentiment={isAnyWarningBad ? 'bad' : 'warning'} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <TokenBreakdownTooltipContent
          total={total}
          associated={associated}
          ether={ether}
          stablecoin={stablecoin}
          associatedTokenSymbols={associatedTokens}
          tvlWarnings={warnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
