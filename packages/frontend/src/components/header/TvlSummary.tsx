import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { formatUSD } from '../../utils/utils'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { BridgedIcon, ExternalIcon, NativeIcon } from '../icons'
import { PercentChange } from '../PercentChange'

export interface TvlStats {
  tvlChange: string
  tvl: number
  ebv: number
  cbv: number
  nmv: number
}

export interface TvlSummaryProps {
  stats?: TvlStats
  detailedTvlEnabled?: boolean
}

export function TvlSummary(props: TvlSummaryProps) {
  const usage = props.stats
    ? {
        cbv: ((props.stats.cbv / props.stats.tvl) * 100).toFixed(),
        ebv: ((props.stats.ebv / props.stats.tvl) * 100).toFixed(),
        nmv: ((props.stats.nmv / props.stats.tvl) * 100).toFixed(),
      }
    : undefined

  const tvlStats = props.stats
    ? [
        {
          label: 'Canonically Bridged',
          value: formatUSD(props.stats.cbv),
          usage: usage?.cbv,
          icon: <BridgedIcon className="h-[8px] w-[8px]" />,
        },
        {
          label: 'Externally Bridged',
          value: formatUSD(props.stats.ebv),
          usage: usage?.ebv,
          icon: <ExternalIcon className="h-[10px] w-[10px]" />,
        },
        {
          label: 'Natively Minted',
          value: formatUSD(props.stats.nmv),
          usage: usage?.nmv,
          icon: <NativeIcon className="h-[8px] w-[8px]" />,
        },
      ]
    : []

  return props.detailedTvlEnabled ? (
    <div className="w-full bg-gray-100 p-4 dark:bg-zinc-800 md:flex md:w-[30%] md:flex-col md:gap-3 md:rounded-lg md:px-6 md:py-5">
      <div className="flex w-full items-baseline justify-between md:gap-2">
        <span className="text-lg font-medium md:hidden md:text-xs md:font-normal md:text-gray-500 md:dark:text-gray-600">
          Value Locked
        </span>
        <span className="hidden text-lg font-bold text-white text-gray-500 dark:text-gray-600 md:block md:text-xs md:font-normal">
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
        <div
          className="Tooltip my-3 flex h-1 w-full flex-wrap md:my-0"
          title={renderToStaticMarkup(<BreakdownTooltip usage={usage} />)}
        >
          <div
            className="h-full rounded-l-full bg-purple-100"
            style={{
              width: `${usage.cbv}%`,
            }}
          />
          <div
            className="h-full bg-yellow-200"
            style={{
              width: `${usage.ebv}%`,
            }}
          />
          <div
            className="h-full rounded-r-full bg-pink-100"
            style={{
              width: `${usage.nmv}%`,
            }}
          />
        </div>
      )}

      {props.stats ? (
        <>
          <div className="h-1/2">
            {tvlStats.map((s, i) => (
              <div key={i} className="flex w-full items-end justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex h-[10px] w-[10px] items-center justify-center md:hidden">
                    {s.icon}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-600">
                    {s.label}
                  </span>
                </div>
                <span className="text-base font-semibold">
                  {s.value}
                  <span className="text-base font-normal text-gray-500 md:hidden">
                    {` (${s.usage}%)`}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  ) : null
}

function BreakdownTooltip({
  usage,
}: {
  usage: { cbv: string; ebv: string; nmv: string }
}) {
  // NOTE(radomski): Explanation of the
  // `grid-cols-[repeat(3,minmax(0,_1fr))_auto]`. I want a two columned grid
  // where the first cell of equal size and the second is free to grow.
  return (
    <div className="grid grid-cols-[minmax(0,_1fr)_auto] gap-x-3">
      <div>Canoncially Bridged</div> <div>{usage.cbv}%</div>
      <div>Externally Bridged</div> <div>{usage.ebv}%</div>
      <div>Native Tokens Minted</div> <div>{usage.nmv}%</div>
    </div>
  )
}
