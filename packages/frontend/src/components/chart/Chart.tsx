import { Milestone } from '@l2beat/config'
import React from 'react'

import { ChartType } from '../../scripts/charts/types'
import { cn } from '../../utils/cn'
import { ActivityHeader } from '../header/ActivityHeader'
import { TvlHeader } from '../header/TvlHeader'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { Logo } from '../Logo'
import { ProjectDetailsSectionHeader } from '../project/ProjectDetailsSection'
import { ChartComingSoonState } from './ChartComingSoonState'
import { ChartEmptyState } from './ChartEmptyState'
import { ChartErrorState } from './ChartErrorState'
import { ChartHover } from './ChartHover'
import { ChartLabels } from './ChartLabels'
import { ChartLoader } from './ChartLoader'
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
  sectionOrder?: number
  settingsId: string
  tokens?: TokenControl[]
  initialType: ChartType
  tvlBreakdownHref?: string
  hasActivity?: boolean
  hasTvl?: boolean
  metaChart?: boolean
  mobileFull?: boolean
  milestones?: Milestone[]
  sectionClassName?: string
  header?: 'tvl' | 'activity' | 'project'
  showComingSoon?: boolean
  withoutSeparator?: boolean
}

export function Chart(props: ChartProps) {
  const isActivity =
    props.initialType.type === 'layer2-activity' ||
    props.initialType.type === 'project-activity' ||
    props.initialType.type === 'storybook-fake-activity'

  const isBridge = props.initialType.type === 'bridges-tvl'

  const id = props.id ?? 'chart'
  const title = props.title ?? 'Chart'

  return (
    <>
      <section
        id={id}
        data-settings-id={props.settingsId}
        data-role={props.showComingSoon ? 'coming-soon-chart' : 'chart'}
        data-interactivity-disabled={props.showComingSoon}
        data-initial-type={JSON.stringify(props.initialType)}
        data-milestones={JSON.stringify(props.milestones)}
        className={cn(
          'group/chart',
          props.mobileFull
            ? 'px-4 py-6 dark:bg-gray-950 md:p-0 md:dark:bg-transparent'
            : 'mt-4',
          props.sectionClassName,
        )}
      >
        <ChartHeader
          title={title}
          id={id}
          sectionOrder={props.sectionOrder}
          hasActivity={props.hasActivity}
          hasTvl={props.hasTvl}
          metaChart={props.metaChart}
          header={props.header}
          isBridge={isBridge}
        />

        <div className="flex flex-col gap-4">
          <div
            className={cn(
              'flex justify-between',
              props.metaChart && 'absolute bottom-0 left-0 w-full',
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
            <div
              className="absolute -bottom-4 -left-4 -right-4 top-0 z-40 group-data-[interactivity-disabled]/chart:hidden"
              data-role="chart-canvas-interaction-zone"
            />
            <ChartEmptyState />
            <ChartErrorState />
            {props.showComingSoon && <ChartComingSoonState />}
            <canvas
              data-role="chart-canvas"
              data-is-meta={props.metaChart}
              className="absolute bottom-0 left-0 z-20 block h-full w-full"
            />
            <ChartLabels
              className={cn(
                props.showComingSoon && 'blur-sm',
                props.metaChart ? 'hidden' : undefined,
              )}
            />
            <div
              data-role="chart-milestones"
              className="absolute bottom-0 z-40 w-[100%] group-data-[interactivity-disabled]/chart:hidden"
            />
          </div>
          <div className="flex justify-between">
            {(props.hasActivity || isActivity) && (
              <EthereumActivityToggle showToggle={isActivity} />
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
      {!props.withoutSeparator && (
        <HorizontalSeparator className="mt-4 hidden md:mt-6 md:block" />
      )}
    </>
  )
}

function ChartHeader(props: {
  id: string
  title: string
  sectionOrder: number | undefined
  hasActivity: boolean | undefined
  hasTvl: boolean | undefined
  metaChart: boolean | undefined
  header: ChartProps['header'] | undefined
  isBridge: boolean
}) {
  if (!props.header || props.metaChart) {
    return null
  }

  if (props.header === 'tvl') {
    return <TvlHeader isBridge={props.isBridge} />
  }

  if (props.header === 'activity') {
    return <ActivityHeader />
  }

  return (
    <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-center md:gap-5">
      <ProjectDetailsSectionHeader
        title={props.title}
        id={props.id}
        sectionOrder={props.sectionOrder}
      />
      {(props.hasActivity || props.hasTvl) && (
        <RadioChartTypeControl
          hasActivity={!!props.hasActivity}
          hasTvl={!!props.hasTvl}
        />
      )}
    </div>
  )
}
