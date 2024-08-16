import { type WarningWithSentiment } from '@l2beat/config'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/app/_components/breakdown/token-breakdown'
import { PercentChange } from '~/app/_components/percent-change'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { formatNumber } from '~/utils/format-number'

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
  layout?: 'end' | 'center'
}

export function TotalCell({ layout = 'end', ...data }: TotalCellProps) {
  const tvlWarnings = data.tvlWarnings ?? []
  const anyBadWarnings = tvlWarnings.some((w) => w?.sentiment === 'bad')

  const totalTvl = data.breakdown.total
  const breakdownOther =
    data.breakdown.total -
    data.breakdown.associated -
    data.breakdown.ether -
    data.breakdown.stablecoin

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn(
            'flex flex-col',
            layout === 'end' ? 'items-end' : 'items-center',
          )}
        >
          <div className="flex items-center gap-1">
            {tvlWarnings.length ? (
              <RoundedWarningIcon
                className="size-4"
                sentiment={anyBadWarnings ? 'bad' : 'warning'}
              />
            ) : null}
            <span className="text-base font-bold md:text-lg">
              ${formatNumber(totalTvl)}
            </span>
            {data.change !== undefined && (
              <PercentChange
                value={data.change}
                className="ml-1 !text-base font-medium"
              />
            )}
          </div>
          <TokenBreakdown
            associated={data.breakdown.associated}
            ether={data.breakdown.ether}
            stablecoin={data.breakdown.stablecoin}
            other={breakdownOther}
            className="h-[3px] w-[180px]"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <TokenBreakdownTooltipContent
          associated={data.breakdown.associated}
          ether={data.breakdown.ether}
          stablecoin={data.breakdown.stablecoin}
          other={breakdownOther}
          tvlWarnings={tvlWarnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
