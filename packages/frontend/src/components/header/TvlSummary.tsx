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
    <div className="w-full bg-gray-100 p-4 dark:bg-zinc-800 md:w-[30%] md:rounded-lg md:px-6 md:py-5">
      <div className="md:justify-normal mb-0 flex w-full justify-between md:mb-4 md:flex-col md:gap-2">
        <span className="text-lg font-bold text-white text-gray-500 dark:text-gray-600 md:text-xs md:font-normal">
          Total Value Locked
        </span>
        {props.stats ? (
          <div className="flex items-center gap-2 md:gap-1">
            <p className="text-lg font-bold md:text-2xl md:leading-none">
              {props.stats.tvl}
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
      {props.stats ? (
        <>
          <div className="h-1/2">
            {tvlStats.map((s, i) => (
              <div key={i} className="flex w-full items-end justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-600">
                  {s.label}
                </span>
                <span className="text-base font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  ) : null
}
