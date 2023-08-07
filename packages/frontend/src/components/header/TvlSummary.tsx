import React from 'react'

import { UpcomingBadge } from '../badge/UpcomingBadge'
import { PercentChange } from '../PercentChange'

export interface TvlStats {
  tvl: string
  tvlChange: string
  ebv: string
  cbv: string
  nmv: string
}

export interface TvlSummaryProps {
  stats?: TvlStats
  detailedTvlEnabled?: boolean
}

export function TvlSummary(props: TvlSummaryProps) {
  const tvlStats = props.stats
    ? [
        {
          label: 'Canonically Bridged',
          value: props.stats.cbv,
        },
        {
          label: 'Externally Bridged',
          value: props.stats.ebv,
        },
        {
          label: 'Natively Minted',
          value: props.stats.nmv,
        },
      ]
    : []

  return props.detailedTvlEnabled ? (
    <div className="w-[30%] p-4 md:rounded-lg md:bg-gray-100 md:px-6 md:py-5 md:dark:bg-zinc-800">
      <div className="flex h-1/2 flex-col gap-2">
        <div className="text-xs text-gray-500 dark:text-gray-600">
          Total Value Locked
        </div>
        {props.stats ? (
          <div className="flex items-center gap-2 md:gap-1">
            <p className="text-lg font-bold md:text-3xl">{props.stats.tvl}</p>
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
      {props.stats ? (
        <>
          <div className="h-1/2">
            {tvlStats.map((s, i) => (
              <div key={i} className="flex w-full items-end justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-600">
                  {s.label}
                </span>
                <span className="text-base">{s.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  ) : null
}
