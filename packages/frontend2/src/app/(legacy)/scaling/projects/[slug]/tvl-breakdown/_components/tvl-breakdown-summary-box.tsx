import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { PercentChange } from '~/components/percent-change'
import InfoIcon from '~/icons/info.svg'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/format'

type ValueWithChange = {
  value: number
  change: number
}

type Props = {
  tvl: ValueWithChange
  native: ValueWithChange
  external: ValueWithChange
  canonical: ValueWithChange
}

export function TvlBreakdownSummaryBox(props: Props) {
  return (
    <div className="flex flex-col justify-between gap-[7px] bg-purple-300 px-4 py-5 dark:bg-purple-700 md:flex-row md:gap-2 md:rounded-lg md:border md:border-pink-200 md:p-6 md:dark:border-pink-900">
      <StatsItem
        title="Total Value Locked"
        tooltip="Total value locked displayed together with a percentage change compared to 7D ago."
        mobileTitle="Total Value Locked"
        value={props.tvl.value}
        change={props.tvl.change}
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
        tooltip="Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago."
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
  big?: boolean
  tooltip: string
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
            props.big
              ? 'text-lg text-black dark:text-white'
              : 'text-xs text-gray-600',
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
        <span
          className={cn(
            'font-bold text-black dark:text-white md:text-lg',
            props.big ? 'text-lg' : 'text-base',
          )}
        >
          {formatCurrency(props.value, 'usd')}
        </span>
        <div className="ml-1 text-xs font-semibold md:text-base">
          <PercentChange value={props.change} />
        </div>
      </div>
    </div>
  )
}
