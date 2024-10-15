import { type WarningWithSentiment } from '@l2beat/config'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/components/breakdown/token-breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { PercentChange } from '~/components/percent-change'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatTvlTableNumber } from '~/utils/number-format/format-tvl-number'

export interface TotalCellProps {
  breakdown: {
    total: number
    ether: number
    stablecoin: number
    associated: number
  }
  associatedTokenSymbols: string[]
  change?: number
  tvlWarnings?: WarningWithSentiment[]
}

export function TotalCell(data: TotalCellProps) {
  const tvlWarnings = data.tvlWarnings ?? []
  const anyBadWarnings = tvlWarnings.some((w) => w?.sentiment === 'bad')

  const totalTvl = data.breakdown.total

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            {tvlWarnings.length ? (
              <RoundedWarningIcon
                className="mr-1 size-4"
                sentiment={anyBadWarnings ? 'bad' : 'warning'}
              />
            ) : null}
            <span className="font-bold md:text-base">
              {formatTvlTableNumber(totalTvl)}
            </span>
            {data.change !== undefined && (
              <PercentChange
                value={data.change}
                className="ml-1 font-medium md:text-base"
              />
            )}
          </div>
          <TokenBreakdown
            total={data.breakdown.total}
            associated={data.breakdown.associated}
            ether={data.breakdown.ether}
            stablecoin={data.breakdown.stablecoin}
            className="h-[3px] w-[180px]"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <TokenBreakdownTooltipContent
          total={data.breakdown.total}
          associated={data.breakdown.associated}
          ether={data.breakdown.ether}
          stablecoin={data.breakdown.stablecoin}
          tvlWarnings={tvlWarnings}
          associatedTokenSymbols={data.associatedTokenSymbols}
        />
      </TooltipContent>
    </Tooltip>
  )
}
