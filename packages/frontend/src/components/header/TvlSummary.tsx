import React from 'react'

import { unifyPercentagesAsIntegers } from '../../utils'
import { formatUSD } from '../../utils/utils'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { CanonicalIcon, ExternalIcon, NativeIcon } from '../icons'
import { Link } from '../Link'
import { PercentChange } from '../PercentChange'

export interface TvlStats {
  tvlChange: string
  tvl: number
  canonical: number
  external: number
  native: number
}

export interface TvlSummaryProps {
  stats?: TvlStats
  detailedTvlEnabled?: boolean
  tvlBreakdownHref?: string
  showTvlBreakdown?: boolean
}

export function TvlSummary(props: TvlSummaryProps) {
  if (!props.detailedTvlEnabled) {
    return null
  }

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
          icon: <CanonicalIcon className="h-[9px] w-[9px]" />,
        },
        {
          label: 'Externally Bridged',
          shortLabel: 'External',
          value: formatUSD(props.stats.external),
          usage: usage?.external ?? 1,
          icon: <ExternalIcon className="h-[10px] w-[10px]" />,
        },
        {
          label: 'Natively Minted',
          shortLabel: 'Native',
          value: formatUSD(props.stats.native),
          usage: usage?.native ?? 1,
          icon: <NativeIcon className="h-[8px] w-[8px]" />,
        },
      ]
    : []

  return (
    <div className="bg-gray-100 p-4 dark:bg-zinc-800 md:flex md:flex-col md:gap-3 md:rounded-lg md:px-6 md:py-4">
      <div className="flex w-full flex-wrap items-baseline justify-between md:gap-2">
        <span className="text-lg font-medium md:hidden md:text-xs md:font-normal md:text-gray-500 md:dark:text-gray-600">
          Value Locked
        </span>
        <span className="hidden text-lg font-bold text-gray-500 dark:text-gray-600 md:block md:text-xs md:font-normal">
          TVL
        </span>

        {props.stats ? (
          <div className="flex items-center gap-2 md:gap-1">
            <p className="text-lg font-bold md:text-2xl md:leading-none">
              {formatUSD(props.stats.tvl)}
            </p>
            <p className="text-xs font-bold md:text-base">
              <PercentChange value={props.stats.tvlChange} />
            </p>
          </div>
        ) : (
          <div className="w-auto">
            <UpcomingBadge />
          </div>
        )}
      </div>

      {usage && (
        <div className="Tooltip my-3 flex h-1 w-full flex-wrap md:my-0">
          <div
            className="h-full rounded-l-full bg-purple-100"
            style={{
              width: `${usage.canonical}%`,
            }}
          />
          <div
            className="h-full bg-yellow-200"
            style={{
              width: `${usage.external}%`,
            }}
          />
          <div
            className="h-full rounded-r-full bg-pink-100"
            style={{
              width: `${usage.native}%`,
            }}
          />
        </div>
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
                  <div className="flex h-[10px] w-[10px] items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-xs leading-none text-gray-500 dark:text-gray-600">
                    <span className="inline md:hidden">{s.label}</span>
                    <span className="hidden md:inline">{s.shortLabel}</span>
                  </span>
                </div>
                <span className="text-base font-semibold leading-none">
                  {s.value}
                  <span className="font-normal text-gray-500">
                    {` (${s.usage}%)`}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {props.showTvlBreakdown ? (
        <div className="flex justify-center">
          <Link href={props.tvlBreakdownHref} className="text-xs">
            View TVL Breakdown
          </Link>
        </div>
      ) : null}
    </div>
  )
}
