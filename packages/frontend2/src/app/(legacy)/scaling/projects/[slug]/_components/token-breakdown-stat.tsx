import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/app/_components/breakdown/token-breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { type ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'

interface Props {
  breakdown:
    | NonNullable<ScalingProjectEntry['header']['tvl']>['tokenBreakdown']
    | undefined
}

export function TokenBreakdownStat({ breakdown }: Props) {
  if (!breakdown) {
    return <UpcomingBadge />
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
