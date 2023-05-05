import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { Logo } from '../Logo'
import { ChartHover } from './ChartHover'
import { ChartLoader } from './ChartLoader'
import { ChartUpcoming } from './ChartUpcoming'
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
  title?: string
  id?: string
  tvlEndpoint?: string
  activityEndpoint?: string
  tokens?: TokenControl[]
  hasActivity?: boolean
  hasTvl?: boolean
  metaChart?: boolean
  mobileFull?: boolean
  milestones?: Milestone[]
  isUpcoming?: boolean
  sectionClassName?: string
}

export function Chart({
  title = 'Chart',
  id = 'chart',
  tvlEndpoint,
  activityEndpoint,
  tokens,
  type = 'tvl',
  hasActivity,
  hasTvl = true,
  metaChart = false,
  mobileFull: fullWidth = false,
  milestones,
  isUpcoming = false,
  sectionClassName,
}: ChartProps) {
  if (isUpcoming) {
    return <ChartUpcoming mobileFull />
  }

  const days = metaChart || type === 'activity' ? 30 : 7
  return (
    <>
      <section
        id={id}
        data-role="chart"
        data-type={type}
        data-tvl-endpoint={tvlEndpoint}
        data-activity-endpoint={activityEndpoint}
        data-milestones={JSON.stringify(milestones)}
        className={cx(
          fullWidth
            ? 'px-4 py-6 dark:bg-gray-950 md:p-0 md:dark:bg-transparent'
            : 'mt-4',
          sectionClassName,
        )}
      >
        {!metaChart && hasTvl && hasActivity && (
          <div className="mb-4 gap-5 md:mb-6 md:flex md:items-center">
            <h2 className="hidden text-2xl font-bold md:block md:text-4xl md:leading-normal">
              <a href={`#${id}`}>{title}</a>
            </h2>
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
            <Logo className="absolute bottom-2 right-2 z-10 h-[25px] w-[60px] opacity-40" />
            <canvas
              data-role="chart-canvas"
              className="absolute bottom-0 left-0 z-20 block h-[calc(100%_-_20px)] w-full"
            />
            <YAxisLabels />
            <div
              data-role="chart-milestones"
              className="absolute bottom-0 w-[100%]"
            />
          </div>
          <div className="flex items-center justify-between">
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
      <HorizontalSeparator className="mt-4 hidden md:mt-6 md:block" />
    </>
  )
}
