import { type WarningWithSentiment } from '@l2beat/config'
import {
  TokenTypeBreakdown,
  TokenTypeBreakdownTooltipContent,
} from '~/app/_components/breakdown/token-type-breakdown'
import { PercentChange } from '~/app/_components/percent-change'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { EM_DASH } from '~/consts/characters'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatCurrency } from '~/utils/format'

export interface TotalValueLockedCellProps {
  breakdown: {
    external: number
    canonical: number
    native: number
  }
  change: number
  tvlWarnings?: WarningWithSentiment[]
}

export function TotalValueLockedCell(data: TotalValueLockedCellProps) {
  const tvlWarnings = data.tvlWarnings ?? []
  const anyBadWarnings = tvlWarnings.some((w) => w?.sentiment === 'bad')
  const total =
    data.breakdown.canonical + data.breakdown.external + data.breakdown.native

  if (total === 0) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-base font-bold md:text-lg">{EM_DASH}</span>
      </div>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            {tvlWarnings.length ? (
              <RoundedWarningIcon
                className="size-4"
                sentiment={anyBadWarnings ? 'bad' : 'warning'}
              />
            ) : null}
            <span className="text-base font-bold md:text-lg">
              {formatCurrency(total, 'usd')}
            </span>
            {data.change !== undefined && (
              <PercentChange
                value={data.change}
                className="ml-1 !text-base font-medium"
              />
            )}
          </div>
          <TokenTypeBreakdown
            canonical={data.breakdown.canonical}
            external={data.breakdown.external}
            native={data.breakdown.native}
            className="h-[3px] w-[180px]"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <TokenTypeBreakdownTooltipContent
          canonical={data.breakdown.canonical}
          external={data.breakdown.external}
          native={data.breakdown.native}
          tvlWarnings={tvlWarnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
