import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { Logo } from '../Logo'
import { ChartHover } from './ChartHover'
import { ChartLoader } from './ChartLoader'
import { ChartUpcoming } from './ChartUpcoming'
import { TokenControl } from './CommonTokenControls'
import { ChartType } from './configure/state/State'
import { CurrencyControls } from './CurrencyControls'
import { DesktopTokenControls } from './DesktopTokenControls'
import { EthereumActivityToggle } from './EthereumActivityToggle'
import { MobileTokenControls } from './MobileTokenControls'
import { RadioChartTypeControl } from './RadioChartTypeControl'
import { RangeControls } from './RangeControls'
import { ScaleControls } from './ScaleControls'
import { TimeRange } from './TimeRange'
import { TokenControlsToBeRemoved } from './TokenControlsToBeRemoved'

export interface ChartProps {
  type?: ChartType
  title?: string
  id?: string
  tvlEndpoint?: string
  detailedTvlEndpoint?: string
  activityEndpoint?: string
  tokens?: TokenControl[]
  hasActivity?: boolean
  hasTvl?: boolean
  hasDetailedTvl?: boolean
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
  detailedTvlEndpoint,
  activityEndpoint,
  tokens,
  type = 'tvl',
  hasActivity,
  hasTvl = true,
  hasDetailedTvl,
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
        data-detailed-tvl-endpoint={detailedTvlEndpoint}
        data-activity-endpoint={activityEndpoint}
        data-milestones={JSON.stringify(milestones)}
        className={cx(
          fullWidth
            ? 'px-4 py-6 dark:bg-gray-950 md:p-0 md:dark:bg-transparent'
            : 'mt-4',
          sectionClassName,
        )}
      >
        {!metaChart &&
          ((hasTvl && hasActivity) || (hasTvl && hasDetailedTvl)) && (
            <div className="mb-4 gap-5 md:mb-6 md:flex md:items-center">
              <h2 className="hidden text-2xl font-bold md:block md:text-4xl md:leading-normal">
                <a href={`#${id}`}>{title}</a>
              </h2>

              <RadioChartTypeControl
                hasActivity={hasActivity ?? false}
                hasDetailedTvl={hasDetailedTvl ?? false}
              />
            </div>
          )}
        <div className="flex flex-col gap-4">
          <div
            className={`flex justify-between ${
              metaChart ? 'absolute left-0 bottom-0 w-full' : ''
            }`}
          >
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
            <Logo className="absolute bottom-2 right-2 z-30 h-[25px] w-[60px] opacity-20" />
            <canvas
              data-role="chart-canvas"
              data-is-meta={metaChart}
              className="absolute bottom-0 left-0 z-20 block h-full w-full"
            />
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
            {hasTvl && (
              <div className="flex h-[2rem] items-end">
                <CurrencyControls />
                {hasDetailedTvl && <DesktopTokenControls tokens={tokens} />}
              </div>
            )}
            <ScaleControls />
          </div>
          {hasTvl && !hasDetailedTvl ? (
            <TokenControlsToBeRemoved tokens={tokens} />
          ) : (
            <MobileTokenControls tokens={tokens} />
          )}
        </div>
      </section>
      <HorizontalSeparator className="mt-4 hidden md:mt-6 md:block" />
    </>
  )
}
