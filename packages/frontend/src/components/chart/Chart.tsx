import React from 'react'

import { Logo } from '../Logo'
import { ChartHover } from './ChartHover'
import { ChartLoader } from './ChartLoader'
import { CurrencyControls } from './CurrencyControls'
import { EthereumActivityToggle } from './EthereumActivityToggle'
import { RangeControls } from './RangeControls'
import { ScaleControls } from './ScaleControls'
import { TimeRange } from './TimeRange'
import { TokenControl, TokenControls } from './TokenControls'
import { TvlActivityToggle } from './TvlActivityToggle'
import { YAxisLabels } from './YAxisLabels'

export interface ChartProps {
  initialView: 'tvl' | 'activity'
  tvlEndpoint?: string
  activityEndpoint?: string
  ethereumActivityEndpoint?: string
  tokens?: TokenControl[]
  isMetaChart?: boolean
}

export function Chart({
  tvlEndpoint,
  activityEndpoint,
  ethereumActivityEndpoint,
  tokens,
  initialView,
  isMetaChart = false,
}: ChartProps) {
  const days = isMetaChart || initialView === 'activity' ? 30 : 7

  return (
    <section
      data-role="chart"
      data-type={initialView}
      data-tvl-endpoint={tvlEndpoint}
      data-activity-endpoint={activityEndpoint}
      data-ethereum-activity-endpoint={ethereumActivityEndpoint}
      className="mt-4 sm:mt-8"
    >
      {!isMetaChart && (
        <div className="md:flex gap-5 md:items-center mb-4 md:mb-6">
          <h2 className="hidden md:inline text-3xl font-bold">Chart</h2>
          {activityEndpoint && tvlEndpoint && <TvlActivityToggle />}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <TimeRange />
          <RangeControls days={days} type={initialView} />
        </div>
        <div
          data-role="chart-view"
          className="relative col-span-4 h-[160px] xs:h-[200px] sm:h-[260px]"
          role="img"
          aria-label="chart"
        >
          <ChartLoader />
          <ChartHover />
          <Logo className="absolute bottom-2 right-2 z-10 w-[60px] h-[25px] opacity-40" />
          <canvas
            data-role="chart-canvas"
            className="absolute z-20 bottom-0 left-0 block w-full h-[calc(100%_-_20px)]"
          />
          <YAxisLabels />
        </div>
        {!isMetaChart && (
          <>
            <div className="flex justify-between">
              {activityEndpoint && (
                <EthereumActivityToggle
                  showToggle={initialView === 'activity'}
                />
              )}
              {tvlEndpoint && <CurrencyControls />}
              <ScaleControls />
            </div>
            {tvlEndpoint && <TokenControls tokens={tokens} />}{' '}
          </>
        )}
      </div>
    </section>
  )
}
