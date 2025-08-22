import type { WarningWithSentiment } from '@l2beat/config'
import {
  ChartStats,
  ChartStatsItem,
  ChartStatsPrimaryItem,
} from '~/components/core/chart/ChartStats'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

type Props = {
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
  warning: WarningWithSentiment | undefined
}

export function TvsBreakdownSummaryBox({ breakdown, change, warning }: Props) {
  return (
    <ChartStats className="md:gap-8">
      <ChartStatsPrimaryItem
        className="col-span-1 md:col-span-2 lg:col-span-1"
        label="Total"
        tooltip="Total value secured displayed together with a percentage change compared to 7D ago."
      >
        <ValueWithPercentageChange
          change={change.total}
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
          {formatCurrency(breakdown.total, 'usd')}
        </ValueWithPercentageChange>
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
            value={breakdown.canonical}
            change={change.canonical}
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
          <StatItemContent value={breakdown.native} change={change.native} />
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
            value={breakdown.external}
            change={change.external}
          />
        </ChartStatsItem>
        <HorizontalSeparator className="my-1 md:col-span-3" />
        <ChartStatsItem label="ETH & derivatives">
          <StatItemContent value={breakdown.ether} change={change.ether} />
        </ChartStatsItem>
        <ChartStatsItem label="Stablecoins">
          <StatItemContent
            value={breakdown.stablecoin}
            change={change.stablecoin}
          />
        </ChartStatsItem>
        <ChartStatsItem label="BTC & derivatives">
          <StatItemContent value={breakdown.btc} change={change.btc} />
        </ChartStatsItem>
        <ChartStatsItem label="Other">
          <StatItemContent value={breakdown.other} change={change.other} />
        </ChartStatsItem>
      </div>
    </ChartStats>
  )
}

interface StatsItemProps {
  value: number
  change: number
  warning?: WarningWithSentiment
}

function StatItemContent(props: StatsItemProps) {
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
