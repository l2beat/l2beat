import type { WarningWithSentiment } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
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
import { PercentChange } from '~/components/PercentChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import {
  PERIOD_LABEL,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'

export type TvsData = {
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
  changePeriod: PercentageChangePeriod
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
        tooltip="Total value secured displayed together with a percentage change compared to 7 days ago."
      >
        {isLoading ? (
          <div className="flex items-end gap-3.5 lg:flex-col lg:items-center lg:gap-0.5">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-13" />
          </div>
        ) : (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 lg:flex-col lg:items-center">
            <span className="font-bold text-heading-24 text-primary leading-none">
              {warning && (
                <Tooltip>
                  <TooltipTrigger
                    className="relative top-[3px] mr-2"
                    aria-label="TVS warning"
                  >
                    <RoundedWarningIcon
                      sentiment={warning?.sentiment}
                      className="size-6"
                      aria-hidden
                    />
                  </TooltipTrigger>
                  <TooltipContent>{warning?.value}</TooltipContent>
                </Tooltip>
              )}
              {formatCurrency(tvsData?.breakdown.total ?? 0, 'usd')}
            </span>
            <ChangeWithPeriod
              change={tvsData?.change.total}
              period={tvsData?.changePeriod}
            />
          </div>
        )}
      </ChartStatsPrimaryItem>
      <div className="grid gap-2 max-md:mt-3 md:col-span-3 md:grid-cols-3 md:gap-3">
        <ChartStatsItem
          label={
            <>
              <span className="max-md:hidden">Canonically bridged</span>
              <span className="max-xs:hidden md:hidden">
                Canonically bridged value
              </span>
              <span className="xs:hidden">Canonical</span>
            </>
          }
          tooltip="Total value secured in escrow contracts on Ethereum displayed together with a percentage change compared to 7 days ago."
        >
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.canonical}
            change={tvsData?.change.canonical}
            changePeriod={tvsData?.changePeriod}
          />
        </ChartStatsItem>
        <ChartStatsItem
          label={
            <>
              <span className="max-md:hidden">Natively minted</span>
              <span className="max-xs:hidden md:hidden">
                Natively minted tokens
              </span>
              <span className="xs:hidden">Native</span>
            </>
          }
          tooltip="Total value of natively minted tokens displayed together with a percentage change compared to 7 days ago."
        >
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.native}
            change={tvsData?.change.native}
            changePeriod={tvsData?.changePeriod}
          />
        </ChartStatsItem>
        <ChartStatsItem
          label={
            <>
              <span className="max-md:hidden">Externally bridged</span>
              <span className="max-xs:hidden md:hidden">
                Externally bridged value
              </span>
              <span className="xs:hidden">External</span>
            </>
          }
          tooltip="Total value of externally bridged tokens displayed together with a percentage change compared to 7 days ago."
        >
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.external}
            change={tvsData?.change.external}
            changePeriod={tvsData?.changePeriod}
          />
        </ChartStatsItem>
        <HorizontalSeparator className="my-1 md:col-span-3" />
        <ChartStatsItem label="ETH & derivatives">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.ether}
            change={tvsData?.change.ether}
            changePeriod={tvsData?.changePeriod}
          />
        </ChartStatsItem>
        <ChartStatsItem label="Stablecoins">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.stablecoin}
            change={tvsData?.change.stablecoin}
            changePeriod={tvsData?.changePeriod}
          />
        </ChartStatsItem>
        <ChartStatsItem label="BTC & derivatives">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.btc}
            change={tvsData?.change.btc}
            changePeriod={tvsData?.changePeriod}
          />
        </ChartStatsItem>
        <ChartStatsItem label="Other">
          <StatItemContent
            isLoading={isLoading}
            value={tvsData?.breakdown.other}
            change={tvsData?.change.other}
            changePeriod={tvsData?.changePeriod}
          />
        </ChartStatsItem>
      </div>
    </ChartStats>
  )
}

interface StatsItemProps {
  value: number | undefined
  change: number | undefined
  changePeriod: PercentageChangePeriod | undefined
  warning?: WarningWithSentiment
  isLoading: boolean
}

function StatItemContent(props: StatsItemProps) {
  if (props.isLoading) return <Skeleton className="h-[20px] w-32" />
  if (props.value === undefined) return <NoDataBadge />

  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
      <span className="font-bold text-primary leading-none md:text-lg">
        {formatCurrency(props.value, 'usd')}
      </span>
      <ChangeWithPeriod change={props.change} period={props.changePeriod} />
      {props.warning && (
        <Tooltip>
          <TooltipTrigger aria-label="Warning">
            <RoundedWarningIcon
              sentiment={props.warning.sentiment}
              className="size-5"
              aria-hidden
            />
          </TooltipTrigger>
          <TooltipContent>{props.warning.value}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

/** "−4.63% / 7d", as on the value secured tiles and the chart heads. */
function ChangeWithPeriod({
  change,
  period,
}: {
  change: number | undefined
  period: PercentageChangePeriod | undefined
}) {
  if (change === undefined || period === undefined) return null
  return (
    <span className="flex items-baseline gap-1 whitespace-nowrap font-medium text-label-value-13 leading-none">
      <PercentChange
        className="min-w-0 cursor-default text-left"
        textClassName="text-label-value-13"
        value={change}
        period={period}
      />
      <span className="text-secondary">/ {PERIOD_LABEL[period]}</span>
    </span>
  )
}
