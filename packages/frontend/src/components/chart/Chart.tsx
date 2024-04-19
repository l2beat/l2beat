import { Milestone } from '@l2beat/config'
import React from 'react'

import { ProjectDetailsSectionHeader } from '../../pages/project/components/sections/common/Section'
import { ChartType } from '../../scripts/charts/types'
import { cn } from '../../utils/cn'
import { ActivityHeader } from '../header/ActivityHeader'
import { CostsHeader } from '../header/CostsHeader'
import { TvlHeader } from '../header/TvlHeader'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { Logo } from '../Logo'
import { ChartComingSoonState } from './ChartComingSoonState'
import { ChartEmptyState } from './ChartEmptyState'
import { ChartErrorState } from './ChartErrorState'
import { ChartHover } from './ChartHover'
import { ChartLabels } from './ChartLabels'
import { ChartLoader } from './ChartLoader'
import { UnitControls } from './CurrencyControls'
import { EthereumActivityToggle } from './EthereumActivityToggle'
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
  metaChart?: boolean
  mobileFull?: boolean
  milestones?: Milestone[]
  sectionClassName?: string
  header?: 'tvl' | 'activity' | 'costs' | 'project'
  showComingSoon?: boolean
  withoutSeparator?: boolean
}

export function Chart(props: ChartProps) {
  const isActivity =
    props.initialType.type === 'scaling-activity' ||
    props.initialType.type === 'project-activity' ||
    props.initialType.type === 'storybook-fake-activity'
  const isProjectSection = props.header === 'project'
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
          props.metaChart && 'mt-0',
          props.sectionClassName,
        )}
      >
        <ChartHeader
          title={title}
          id={id}
          sectionOrder={props.sectionOrder}
          metaChart={props.metaChart}
          header={props.header}
          isBridge={isBridge}
        />

        <div className="flex flex-col gap-4">
          <div
            className={cn(
              'flex flex-wrap justify-between gap-2',
              props.metaChart && 'absolute bottom-0 left-0 w-full',
            )}
          >
            <TimeRange isMetaChart={!!props.metaChart} />
            <RangeControls
              chartType={props.initialType}
              isMetaChart={!!props.metaChart}
            />
          </div>
          <div
            data-role="chart-view"
            className={cn(
              'relative col-span-4 h-[160px] xs:h-[200px] sm:h-[260px]',
              props.metaChart && 'relative h-[262px]',
            )}
            role="img"
            aria-label="chart"
          >
            <ChartLoader />
            <ChartHover />
            <Logo
              className={cn(
                'absolute bottom-2 right-2 z-30 h-[25px] w-[60px] opacity-20',
                props.metaChart && 'hidden',
              )}
            />
            <div
              className="absolute -inset-x-4 -bottom-4 top-0 z-40 group-data-[interactivity-disabled]/chart:hidden"
              data-role="chart-canvas-interaction-zone"
            />
            <ChartEmptyState />
            <ChartErrorState />
            {props.showComingSoon && <ChartComingSoonState />}
            <canvas
              data-role="chart-canvas"
              data-is-meta={props.metaChart}
              className={cn(
                'absolute bottom-0 left-0 z-20 block size-full',
                props.metaChart && 'bottom-[unset] top-0 h-[242px]',
              )}
            />
            <ChartLabels
              className={cn(
                props.showComingSoon && 'blur-sm',
                props.metaChart ? 'hidden' : undefined,
              )}
            />
            <div
              data-role="chart-milestones"
              className="absolute bottom-0 z-40 w-full group-data-[interactivity-disabled]/chart:hidden"
            />
          </div>
          <div className="flex justify-between">
            {isActivity && (
              <EthereumActivityToggle
                showToggle={isActivity}
                isProjectSection={isProjectSection}
              />
            )}
            {!isActivity && (
              <div className="mr-4 flex flex-wrap gap-x-4 gap-y-2">
                <UnitControls chartType={props.initialType} />
                <TokenControls
                  tvlBreakdownHref={props.tvlBreakdownHref}
                  tokens={props.tokens}
                />
              </div>
            )}
            <div className="w-min">
              <ScaleControls chartType={props.initialType} />
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

  if (props.header === 'costs') {
    return <CostsHeader />
  }

  return (
    <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-center md:gap-5">
      <ProjectDetailsSectionHeader
        title={props.title}
        id={props.id}
        sectionOrder={props.sectionOrder}
      />
    </div>
  )
}
