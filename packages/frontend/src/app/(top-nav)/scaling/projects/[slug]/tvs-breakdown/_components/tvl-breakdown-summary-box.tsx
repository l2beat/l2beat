import { type WarningWithSentiment } from '@l2beat/config'
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

export function TvlBreakdownSummaryBox(props: Props) {
  return (
    <div className="flex flex-col justify-between gap-[7px] bg-purple-300 px-4 py-5 dark:bg-purple-700 md:flex-row md:gap-2 md:rounded-lg md:border md:border-pink-200 md:p-6 md:dark:border-pink-900">
      <StatsItem
        title="Total value secured"
        tooltip="Total value secured displayed together with a percentage change compared to 7D ago."
        mobileTitle="Total value secured"
        value={props.total.value}
        change={props.total.change}
        warning={props.warning}
        big
      />
      <StatsItem
        title="Natively Minted"
        tooltip="Total value of natively minted tokens displayed together with a percentage change compared to 7D ago."
        mobileTitle="Natively Minted Tokens"
        value={props.native.value}
        change={props.native.change}
      />
      <StatsItem
        title="Externally Bridged"
        tooltip="Total value of externally bridged tokens displayed together with a percentage change compared to 7D ago."
        mobileTitle="Externally Bridged Value"
        value={props.external.value}
        change={props.external.change}
      />
      <StatsItem
        title="Canonically Bridged"
        tooltip="Total value secured in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago."
        mobileTitle="Canonically Bridged Value"
        value={props.canonical.value}
        change={props.canonical.change}
      />
    </div>
  )
}

interface StatsItemProps {
  title: string
  mobileTitle: string
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
        <span className="hidden text-xs font-medium text-gray-500 dark:text-gray-600 md:inline">
          {props.title}
        </span>
        <span
          className={cn(
            'font-medium md:hidden',
            props.big ? 'text-lg text-primary' : 'text-xs text-gray-600',
          )}
        >
          {props.mobileTitle}
        </span>

        <Tooltip>
          <TooltipTrigger className="ml-0.5 -translate-y-px md:translate-y-0">
            <InfoIcon
              className={cn(
                'md:size-3.5',
                props.big
                  ? 'fill-black dark:fill-white md:fill-gray-500 md:dark:fill-gray-600'
                  : 'fill-gray-500 dark:fill-gray-600',
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
            <TooltipContent>{props.warning.content}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
