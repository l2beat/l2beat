import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { ChartType } from '../../scripts/charts/types'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { Logo } from '../Logo'
import { ChartHover } from './ChartHover'
import { ChartLabels } from './ChartLabels'
import { ChartLoader } from './ChartLoader'
import { ChartUpcoming } from './ChartUpcoming'
import { CurrencyControls } from './CurrencyControls'
import { EthereumActivityToggle } from './EthereumActivityToggle'
import { RadioChartTypeControl } from './RadioChartTypeControl'
import { RangeControls } from './RangeControls'
import { ScaleControls } from './ScaleControls'
import { TimeRange } from './TimeRange'
import { TokenControl, TokenControls } from './TokenControls'

export interface ChartProps {
  title?: string
  id?: string
  settingsId: string
  tokens?: TokenControl[]
  initialType: ChartType
  tvlBreakdownHref?: string
  hasActivity?: boolean
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
        {!props.metaChart && props.hasActivity && (
          <div className="mb-4 gap-5 md:mb-6 md:flex md:items-center">
            <h2 className="hidden text-2xl font-bold md:block md:text-4xl md:leading-normal">
              <a href={`#${id}`}>{title}</a>
            </h2>

            <RadioChartTypeControl hasActivity={props.hasActivity} />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div
            className={cx(
              'flex justify-between',
              props.metaChart && 'absolute left-0 bottom-0 w-full',
            )}
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
            <ChartLabels className={props.metaChart ? 'hidden' : undefined} />
            <div
              data-role="chart-milestones"
              className="absolute bottom-0 w-[100%]"
            />
          </div>
          <div className="flex justify-between">
            {(props.hasActivity || isActivity) && (
              <EthereumActivityToggle
                showToggle={isActivity}
                className="max-w-[135px] xs:max-w-none"
              />
            )}
            {!isActivity && (
              <div className="mr-4 flex flex-wrap gap-4" data-tvl-only>
                <CurrencyControls />
                <TokenControls
                  tvlBreakdownHref={props.tvlBreakdownHref}
                  tokens={props.tokens}
                />
              </div>
            )}
            <div className="w-min">
              <ScaleControls />
            </div>
          </div>
        </div>
      </section>
      <HorizontalSeparator className="mt-4 hidden md:mt-6 md:block" />
    </>
  )
}
