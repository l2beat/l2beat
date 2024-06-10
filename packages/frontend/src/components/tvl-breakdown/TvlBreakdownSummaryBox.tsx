import React from 'react'

import { TvlBreakdownViewProps } from '../../pages/scaling/projects-tvl-breakdown/props/getTvlBreakdownView'
import { cn } from '../../utils/cn'
import { PercentChange } from '../PercentChange'
import { InfoIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export function TvlBreakdownSummaryBox(
  props: TvlBreakdownViewProps['tvlBreakdownSummary'],
) {
  return (
    <div className="flex flex-col justify-between gap-[7px] bg-purple-300 px-4 py-5 md:flex-row md:gap-2 md:rounded-lg md:border md:border-pink-200 md:dark:border-pink-900 dark:bg-purple-700 md:p-6">
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
  value: string
  change: string
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
        <span className="hidden font-medium text-gray-500 text-xs md:inline dark:text-gray-600">
          {props.title}
        </span>
        <span
          className={cn(
            'font-medium md:hidden',
            props.big
              ? 'text-black text-lg dark:text-white'
              : 'text-gray-600 text-xs',
          )}
        >
          {props.mobileTitle}
        </span>

        <Tooltip>
          <TooltipTrigger className="-translate-y-px ml-0.5 md:translate-y-0">
            <InfoIcon
              className={cn(
                'md:size-3.5',
                props.big
                  ? 'fill-black dark:fill-white md:dark:fill-gray-600 md:fill-gray-500'
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
          {props.value}
        </span>
        <div className="ml-1 font-semibold text-xs md:text-base">
          <PercentChange value={props.change} />
        </div>
      </div>
    </div>
  )
}
