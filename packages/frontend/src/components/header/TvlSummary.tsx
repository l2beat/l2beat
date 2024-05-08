import { WarningWithSentiment } from '@l2beat/config'
import React from 'react'

import { unifyPercentagesAsIntegers } from '../../utils'
import { formatUSD } from '../../utils/utils'
import { Link } from '../Link'
import { PercentChange } from '../PercentChange'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { ValueLockedBreakdown } from '../breakdown/ValueLockedBreakdown'
import {
  CanonicalIcon,
  ExternalIcon,
  NativeIcon,
  RoundedWarningIcon,
} from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface TvlStats {
  tvlChange: string
  tvl: number
  canonical: number
  external: number
  native: number
}

export interface TvlSummaryProps {
  stats?: TvlStats
  tvlBreakdownHref?: string
  tvlWarning?: WarningWithSentiment
  showTvlBreakdown?: boolean
  isArchived?: boolean
  type?: 'bridge' | 'layer2' | 'layer3'
}

export function TvlSummary(props: TvlSummaryProps) {
  const parts = props.stats
    ? unifyPercentagesAsIntegers([
        props.stats.tvl === 0
          ? 100 / 3
          : (props.stats.canonical / props.stats.tvl) * 100,
        props.stats.tvl === 0
          ? 100 / 3
          : (props.stats.external / props.stats.tvl) * 100,
        props.stats.tvl === 0
          ? 100 / 3
          : (props.stats.native / props.stats.tvl) * 100,
      ])
    : undefined

  const usage = parts
    ? {
        canonical: parts[0],
        external: parts[1],
        native: parts[2],
      }
    : undefined

  const tvlStats = props.stats
    ? [
        {
          label: 'Canonically Bridged',
          shortLabel: 'Canonical',
          value: formatUSD(props.stats.canonical),
          usage: usage?.canonical ?? 1,
          icon: <CanonicalIcon />,
        },
        {
          label: 'Externally Bridged',
          shortLabel: 'External',
          value: formatUSD(props.stats.external),
          usage: usage?.external ?? 1,
          icon: <ExternalIcon />,
        },
        {
          label: 'Natively Minted',
          shortLabel: 'Native',
          value: formatUSD(props.stats.native),
          usage: usage?.native ?? 1,
          icon: <NativeIcon />,
        },
      ]
    : []

  return (
    <div className="bg-gray-100 p-4 dark:bg-zinc-900 md:flex md:flex-col md:gap-3 md:rounded-lg md:px-6 md:py-4">
      <div className="flex w-full flex-wrap items-baseline justify-between md:gap-2">
        <span className="text-lg font-medium md:hidden md:text-xs md:font-normal md:text-gray-500 md:dark:text-gray-600">
          Value Locked
        </span>
        <span className="hidden text-lg font-bold text-gray-500 dark:text-gray-600 md:block md:text-xs md:font-normal">
          TVL
        </span>

        {props.stats && (props.stats.tvl > 0 || props.isArchived) ? (
          props.tvlWarning ? (
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <p className="text-lg font-bold md:text-2xl md:leading-none">
                  {formatUSD(props.stats.tvl)}
                </p>
                {props.stats.tvl > 0 && (
                  <p className="text-xs font-bold md:text-base">
                    <PercentChange value={props.stats.tvlChange} />
                  </p>
                )}
                {props.tvlWarning && (
                  <RoundedWarningIcon
                    className="size-4"
                    sentiment={props.tvlWarning.sentiment}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>{props.tvlWarning.content}</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-1">
              <p className="text-lg font-bold md:text-2xl md:leading-none">
                {formatUSD(props.stats.tvl)}
              </p>
              {props.stats.tvl > 0 && (
                <p className="text-xs font-bold md:text-base">
                  <PercentChange value={props.stats.tvlChange} />
                </p>
              )}
              {props.tvlWarning && (
                <RoundedWarningIcon className="size-4" sentiment="warning" />
              )}
            </div>
          )
        ) : (
          <div className="w-auto">
            <UpcomingBadge />
          </div>
        )}
      </div>

      {usage && (
        <ValueLockedBreakdown {...usage} className="my-3 h-1 w-full md:my-0" />
      )}

      {props.stats ? (
        <>
          <div className="flex h-1/2 flex-wrap gap-3 md:gap-0">
            {tvlStats.map((s, i) => (
              <div
                key={i}
                className="flex w-full flex-wrap items-end justify-between"
              >
                <div className="flex items-center gap-1">
                  {s.icon}
                  <span className="text-xs leading-none text-gray-500 dark:text-gray-600">
                    <span className="inline md:hidden">{s.label}</span>
                    <span className="hidden md:inline">{s.shortLabel}</span>
                  </span>
                </div>
                <span className="text-base font-semibold leading-none">
                  {s.value}
                  {props.stats && props.stats.tvl > 0 && (
                    <span className="hidden font-normal text-gray-500 lg:inline">
                      {` (${s.usage}%)`}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {props.showTvlBreakdown ? (
        <div className="mt-2 flex justify-center md:mt-0">
          <Link href={props.tvlBreakdownHref} className="text-xs">
            View TVL Breakdown
          </Link>
        </div>
      ) : null}
    </div>
  )
}
