import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { ChartType } from '../../scripts/charts/ChartDataController'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { Logo } from '../Logo'
import { ChartHover } from './ChartHover'
import { ChartLabels } from './ChartLabels'
import { ChartLoader } from './ChartLoader'
import { ChartUpcoming } from './ChartUpcoming'
import { TokenControl } from './CommonTokenControls'
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
  title?: string
  id?: string
  settingsId: string
  tokens?: TokenControl[]
  initialType: ChartType
  tvlBreakdownHref?: string
  hasActivity?: boolean
  hasTvl?: boolean
  hasDetailedTvl?: boolean
  metaChart?: boolean
  mobileFull?: boolean
  milestones?: Milestone[]
  isUpcoming?: boolean
  sectionClassName?: string
}

export function Chart(props: ChartProps) {
  if (props.isUpcoming) {
    return <ChartUpcoming mobileFull />
  }

  const isActivity =
    props.initialType.type === 'layer2-activity' ||
    props.initialType.type === 'project-activity'

  const id = props.id ?? 'chart'
  const title = props.title ?? 'Chart'
  const tvlBreakdownHref = props.tvlBreakdownHref ?? '/'

  return (
    <>
      <section
        id={id}
        data-settings-id={props.settingsId}
        data-role="chart"
        data-initial-type={JSON.stringify(props.initialType)}
        data-milestones={JSON.stringify(props.milestones)}
        className={cx(
          props.mobileFull
            ? 'px-4 py-6 dark:bg-gray-950 md:p-0 md:dark:bg-transparent'
            : 'mt-4',
          props.sectionClassName,
        )}
      >
        {!props.metaChart &&
          ((props.hasTvl && props.hasActivity) ||
            (props.hasTvl && props.hasDetailedTvl)) && (
            <div className="mb-4 gap-5 md:mb-6 md:flex md:items-center">
              <h2 className="hidden text-2xl font-bold md:block md:text-4xl md:leading-normal">
                <a href={`#${id}`}>{title}</a>
              </h2>

              <RadioChartTypeControl
                hasActivity={props.hasActivity ?? false}
                hasDetailedTvl={props.hasDetailedTvl ?? false}
              />
            </div>
          )}
        <div className="flex flex-col gap-4">
          <div
            className={`flex justify-between ${
              props.metaChart ? 'absolute left-0 bottom-0 w-full' : ''
            }`}
          >
            <TimeRange />
            <RangeControls isActivity={isActivity} />
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
              data-is-meta={props.metaChart}
              className="absolute bottom-0 left-0 z-20 block h-full w-full"
            />
            <ChartLabels />
            <div
              data-role="chart-milestones"
              className="absolute bottom-0 w-[100%]"
            />
          </div>
          <div className="flex items-center justify-between">
            {props.hasActivity && (
              <EthereumActivityToggle
                showToggle={isActivity}
                className="max-w-[135px] xs:max-w-none"
              />
            )}
            {props.hasTvl && (
              <div className="flex h-[2rem] items-end">
                <CurrencyControls />
                {props.hasDetailedTvl && (
                  <DesktopTokenControls
                    tvlBreakdownHref={tvlBreakdownHref}
                    tokens={props.tokens}
                  />
                )}
              </div>
            )}
            <ScaleControls />
          </div>
          {props.hasTvl && !props.hasDetailedTvl ? (
            <TokenControlsToBeRemoved tokens={props.tokens} />
          ) : (
            <MobileTokenControls
              tokens={props.tokens}
              tvlBreakdownHref={tvlBreakdownHref}
            />
          )}
        </div>
      </section>
      <HorizontalSeparator className="mt-4 hidden md:mt-6 md:block" />
    </>
  )
}
