import type { WarningWithSentiment } from '@l2beat/config'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

type ValueWithChange = {
  value: number
  change: number
}

type Props = {
  total: ValueWithChange
  native: ValueWithChange
  external: ValueWithChange
  canonical: ValueWithChange
  warning: WarningWithSentiment | undefined
}

export function TvsBreakdownSummaryBox(props: Props) {
  return (
    <ChartStats>
      <ChartStatsItem
        label={
          <>
            <span className="max-xs:hidden">Total value secured</span>
            <span className="xs:hidden">Total</span>
          </>
        }
        tooltip="Total value secured displayed together with a percentage change compared to 7D ago."
      >
        <StatItemContent
          value={props.total.value}
          change={props.total.change}
          warning={props.warning}
        />
      </ChartStatsItem>
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
          value={props.canonical.value}
          change={props.canonical.change}
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
          value={props.native.value}
          change={props.native.change}
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
          value={props.external.value}
          change={props.external.change}
        />
      </ChartStatsItem>
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
        className="font-bold text-primary md:text-lg"
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
