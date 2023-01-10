import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
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
  type?: 'tvl' | 'activity'
  tvlEndpoint?: string
  activityEndpoint?: string
  tokens?: TokenControl[]
  className?: string
  hasActivity?: boolean
  hasTvl?: boolean
  metaChart?: boolean
  mobileFull?: boolean
  milestones?: Milestone[]
}

export function Chart({
  tvlEndpoint,
  activityEndpoint,
  tokens,
  type = 'tvl',
  hasActivity,
  hasTvl = true,
  metaChart = false,
  mobileFull: fullWidth = false,
  milestones,
}: ChartProps) {
  const days = metaChart || type === 'activity' ? 30 : 7
  return (
    <>
      <section
        data-role="chart"
        data-type={type}
        data-tvl-endpoint={tvlEndpoint}
        data-activity-endpoint={activityEndpoint}
        data-milestones={JSON.stringify(milestones)}
        className={cx(
          fullWidth
            ? 'px-4 py-6 bg-gray-100 dark:bg-gray-950 md:bg-transparent md:dark:bg-transparent md:p-0'
            : 'mt-4',
          'md:mt-8',
        )}
      >
        {!metaChart && hasActivity && hasTvl && (
          <div className="md:flex gap-5 md:items-center mb-4 md:mb-6">
            <h2 className="hidden md:inline text-3xl font-bold">Chart</h2>
            <TvlActivityToggle />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <TimeRange />
            <RangeControls days={days} type={type} />
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
            <div
              data-role="chart-milestones"
              className="absolute bottom-0 w-[100%]"
            />
          </div>
          <div className="flex justify-between items-center">
            {hasActivity && (
              <EthereumActivityToggle
                showToggle={type === 'activity'}
                className="max-w-[135px] xs:max-w-none"
              />
            )}
            {hasTvl && <CurrencyControls />}
            <ScaleControls />
          </div>
          {hasTvl && <TokenControls tokens={tokens} />}
        </div>
      </section>
      <HorizontalSeparator className="hidden md:block mt-4 md:mt-6" />
    </>
  )
}
