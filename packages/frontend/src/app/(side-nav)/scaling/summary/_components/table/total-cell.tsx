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
import { EM_DASH } from '~/consts/characters'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatCurrency } from '~/utils/format'

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

  if (totalTvl === 0) {
    return (
      <div className="flex flex-col items-end">
        <span className="text-base v2:text-xs md:!text-lg">{EM_DASH}</span>
      </div>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {tvlWarnings.length ? (
              <RoundedWarningIcon
                className="size-4"
                sentiment={anyBadWarnings ? 'bad' : 'warning'}
              />
            ) : null}
            <span className="text-base font-bold v2:text-xs md:!text-lg">
              {formatCurrency(totalTvl, 'usd', {
                showLessThanMinimum: false,
              })}
            </span>
            {data.change !== undefined && (
              <PercentChange
                value={data.change}
                className="ml-1 text-base font-medium v2:text-xs"
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
