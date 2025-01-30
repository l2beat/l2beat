import type { WarningWithSentiment } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { InfoIcon } from '~/icons/info'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/format-currency'

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
    <div className="flex flex-col justify-between gap-[7px] py-5 md:flex-row md:gap-2 md:rounded-lg md:bg-surface-primary md:p-6">
      <StatsItem
        title="Total value secured"
        tooltip="Total value secured displayed together with a percentage change compared to 7D ago."
        mobileTitle="Total value secured"
        smallMobileTitle="Total"
        value={props.total.value}
        change={props.total.change}
        warning={props.warning}
        big
      />
      <StatsItem
        title="Natively Minted"
        tooltip="Total value of natively minted tokens displayed together with a percentage change compared to 7D ago."
        mobileTitle="Natively Minted Tokens"
        smallMobileTitle="Native"
        value={props.native.value}
        change={props.native.change}
      />
      <StatsItem
        title="Externally Bridged"
        tooltip="Total value of externally bridged tokens displayed together with a percentage change compared to 7D ago."
        mobileTitle="Externally Bridged Value"
        smallMobileTitle="External"
        value={props.external.value}
        change={props.external.change}
      />
      <StatsItem
        title="Canonically Bridged"
        tooltip="Total value secured in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago."
        mobileTitle="Canonically Bridged Value"
        smallMobileTitle="Canonical"
        value={props.canonical.value}
        change={props.canonical.change}
      />
    </div>
  )
}

interface StatsItemProps {
  title: string
  mobileTitle: string
  smallMobileTitle: string
  value: number
  change: number
  tooltip: string
  big?: boolean
  warning?: WarningWithSentiment
}

function StatsItem(props: StatsItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between md:flex-col md:items-start',
        props.big && 'mb-1',
      )}
    >
      <div className="flex items-center gap-1">
        <span className="hidden text-xs font-medium text-secondary md:inline">
          {props.title}
        </span>
        <span
          className={cn(
            'font-medium max-xs:hidden md:hidden',
            props.big ? 'text-lg text-primary' : 'text-xs text-secondary',
          )}
        >
          {props.mobileTitle}
        </span>
        <span
          className={cn(
            'font-medium xs:hidden',
            props.big ? 'text-lg text-primary' : 'text-xs text-secondary',
          )}
        >
          {props.smallMobileTitle}
        </span>

        <Tooltip>
          <TooltipTrigger className="ml-0.5 -translate-y-px md:translate-y-0">
            <InfoIcon
              className={cn(
                'md:size-3.5',
                props.big
                  ? 'fill-black dark:fill-white md:!fill-secondary'
                  : 'fill-secondary',
              )}
            />
          </TooltipTrigger>
          <TooltipContent>{props.tooltip}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-1">
        <ValueWithPercentageChange
          change={props.change}
          className={cn(
            'font-bold text-primary md:text-lg',
            props.big ? 'text-lg' : 'text-base',
          )}
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
    </div>
  )
}
