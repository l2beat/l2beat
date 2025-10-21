import type { WarningWithSentiment } from '@l2beat/config'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  ChartStats,
  ChartStatsItem,
  ChartStatsPrimaryItem,
} from '~/components/core/chart/ChartStats'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

type TvsData = {
  breakdown: {
    total: number
    native: number
    external: number
    canonical: number
    ether: number
    stablecoin: number
    btc: number
    other: number
  }
  change: {
    total: number
    native: number
    external: number
    canonical: number
    ether: number
    stablecoin: number
    btc: number
    other: number
  }
}

export function TvsBreakdownSummaryBox({
  tvsData,
  isLoading,
  warning,
}: {
  tvsData: TvsData | undefined
  isLoading: boolean
  warning: WarningWithSentiment | undefined
}) {
  return (
    <ChartStats className="md:gap-8">
      <ChartStatsPrimaryItem
        className="col-span-1 md:col-span-2 lg:col-span-1"
        label="Total"
        tooltip="Total value secured displayed together with a percentage change compared to 7D ago."
      >
        {isLoading ? (
          <div className="flex items-end gap-3.5 lg:flex-col lg:items-center lg:gap-0.5">
            <Skeleton className="h-6 w-24 " />
            <Skeleton className="h-4 w-13 " />
          </div>
        ) : (
          <ValueWithPercentageChange
            change={tvsData?.change.total}
            className="font-bold text-heading-24! text-primary leading-none lg:mr-0"
            changeClassName="text-label-value-16"
            containerClassName="lg:flex-col max-lg:items-baseline"
            changeContainerClassName="leading-none"
          >
            {warning && (
              <Tooltip>
                <TooltipTrigger className="relative top-[3px] mr-2">
                  <RoundedWarningIcon
                    sentiment={warning?.sentiment}
                    className="size-6"
                  />
                </TooltipTrigger>
                <TooltipContent>{warning?.value}</TooltipContent>
              </Tooltip>
            )}
            {formatCurrency(tvsData?.breakdown.total ?? 0, 'usd')}
          </ValueWithPercentageChange>
        )}
      </ChartStatsPrimaryItem>
      <div className="grid gap-2 max-md:mt-3 md:col-span-3 md:grid-cols-3 md:gap-3">
        <ChartStatsItem
          label={
            <>
              <span className="max-md:hidden">Canonically Bridged</span>
              <span className="max-xs:hidden md:hidden">
                Canonically Bridged Value
              </span>
              <span className="xs:hidden">Canonical</span>
            </>
          }
          tooltip="Total value secured in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago."
        >
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.canonical}
            change={tvsData?.change.canonical}
          />
        </ChartStatsItem>
        <ChartStatsItem
          label={
            <>
              <span className="max-md:hidden">Natively Minted</span>
              <span className="max-xs:hidden md:hidden">
                Natively Minted Tokens
              </span>
              <span className="xs:hidden">Native</span>
            </>
          }
          tooltip="Total value of natively minted tokens displayed together with a percentage change compared to 7D ago."
        >
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.native}
            change={tvsData?.change.native}
          />
        </ChartStatsItem>
        <ChartStatsItem
          label={
            <>
              <span className="max-md:hidden">Externally Bridged</span>
              <span className="max-xs:hidden md:hidden">
                Externally Bridged Value
              </span>
              <span className="xs:hidden">External</span>
            </>
          }
          tooltip="Total value of externally bridged tokens displayed together with a percentage change compared to 7D ago."
        >
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.external}
            change={tvsData?.change.external}
          />
        </ChartStatsItem>
        <HorizontalSeparator className="my-1 md:col-span-3" />
        <ChartStatsItem label="ETH & derivatives">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.ether}
            change={tvsData?.change.ether}
          />
        </ChartStatsItem>
        <ChartStatsItem label="Stablecoins">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.stablecoin}
            change={tvsData?.change.stablecoin}
          />
        </ChartStatsItem>
        <ChartStatsItem label="BTC & derivatives">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.btc}
            change={tvsData?.change.btc}
          />
        </ChartStatsItem>
        <ChartStatsItem label="Other">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.other}
            change={tvsData?.change.other}
          />
        </ChartStatsItem>
      </div>
    </ChartStats>
  )
}

interface StatsItemProps {
  value: number | undefined
  change: number | undefined
  warning?: WarningWithSentiment
  isLoading: boolean
}

function StatItemContent(props: StatsItemProps) {
  if (props.isLoading) return <Skeleton className="h-[20px] w-32" />
  if (props.value === undefined) return <NoDataBadge />

  return (
    <div className="flex items-center gap-1">
      <ValueWithPercentageChange
        change={props.change}
        changeContainerClassName="leading-none!"
        className="font-bold text-primary leading-none! md:text-lg"
      >
        {formatCurrency(props.value, 'usd')}
      </ValueWithPercentageChange>
      {props.warning && (
        <Tooltip>
          <TooltipTrigger>
            <RoundedWarningIcon
              sentiment={props.warning.sentiment}
              className="size-5"
            />
          </TooltipTrigger>
          <TooltipContent>{props.warning.value}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
