import { Layer2TVLWarning } from '@l2beat/config'
import React from 'react'

import { cn } from '../../utils/cn'
import { RiskValues } from '../../utils/risks/types'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { ProjectLink } from '../icons'
import { ArchivedBar } from '../project/ArchivedBar'
import { ImplementationUnderReviewBar } from '../project/ImplementationUnderReviewBar'
import { UnderReviewBar } from '../project/UnderReviewBar'
import { UpcomingBar } from '../project/UpcomingBar'
import { WarningBar } from '../project/WarningBar'
import { BigRosette } from '../rosette'
import { DesktopProjectLinks } from './DesktopProjectLinks'
import { MobileProjectLinks } from './MobileProjectLinks'
import { ProjectSummary, ProjectSummaryStat } from './ProjectSummary'
import { TvlStats, TvlSummary } from './TvlSummary'

export interface HeaderProps {
  title: string
  titleClassName?: string
  description: string | undefined
  icon?: string
  stats: FullSummaryStats
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  tvlBreakdownHref?: string
  tvlWarning?: Layer2TVLWarning
  showTvlBreakdown?: boolean
  showProjectUnderReview?: boolean
  implementationHasChanged?: boolean
  risks?: RiskValues
  links: ProjectLink[]
  type: 'bridge' | 'layer2' | 'layer3'
  warning?: string | { text: string; href: string }
}

export interface FullSummaryStats {
  summary: ProjectSummaryStat[]
  l2Tvl?: TvlStats
}

export function DetailsHeader(props: HeaderProps) {
  const areAllRisksUpcoming = props.risks
    ? Object.values(props.risks).every((value) => {
        return (
          value.value === '' &&
          value.description === 'No information available.'
        )
      })
    : undefined
  const isL2orL3 = props.type === 'layer2' || props.type === 'layer3'
  return (
    <>
      <header className="flex flex-row justify-end gap-3 bg-gray-100 pt-6 dark:bg-zinc-900 md:gap-0 md:bg-transparent md:dark:bg-transparent">
        <div className="flex w-full flex-wrap divide-y divide-gray-200 dark:divide-gray-850 md:gap-4 md:divide-y-0">
          <div className="mb-4 flex w-full flex-col gap-2 px-4 md:mb-0 md:px-0">
            <h1
              className={cn(
                'relative mb-0 flex items-center justify-start gap-3',
                'whitespace-pre text-3xl font-bold md:text-4xl',
                props.titleClassName,
              )}
            >
              {props.icon && (
                <img
                  className="size-8 md:size-10"
                  src={props.icon}
                  alt={`${props.title} logo`}
                />
              )}
              {props.title}
            </h1>
            {props.description && (
              <div className="mt-4 text-base">{props.description}</div>
            )}
            {props.isArchived && <ArchivedBar />}
            {props.isUpcoming && <UpcomingBar />}
            {props.showProjectUnderReview && <UnderReviewBar />}
            {props.implementationHasChanged && <ImplementationUnderReviewBar />}
            {props.warning && (
              <WarningBar
                text={
                  typeof props.warning === 'string'
                    ? props.warning
                    : props.warning.text
                }
                href={
                  typeof props.warning !== 'string'
                    ? props.warning.href
                    : undefined
                }
                color="yellow"
                isCritical={false}
                className="w-full items-center justify-center p-2.5 text-xs md:text-base"
              />
            )}
          </div>

          <div className="my-2 hidden w-full md:block">
            <DesktopProjectLinks projectLinks={props.links} />
          </div>
          <div
            className={cn(
              'grid w-full divide-y divide-gray-200 dark:divide-gray-850 md:gap-4 md:divide-y-0 ',
              isL2orL3 && 'md:grid-cols-3',
            )}
          >
            {isL2orL3 && (
              <TvlSummary
                stats={props.stats.l2Tvl}
                tvlBreakdownHref={props.tvlBreakdownHref}
                tvlWarning={props.tvlWarning}
                showTvlBreakdown={props.showTvlBreakdown}
                isArchived={props.isArchived}
                type={props.type}
              />
            )}
            <ProjectSummary
              stats={props.stats.summary}
              type={props.type}
              className="md:col-span-2"
            />
          </div>
          <div className="w-full px-4 md:hidden md:px-0">
            <MobileProjectLinks projectLinks={props.links} />
          </div>
        </div>
        {props.risks && (
          <div className="ml-8 mt-auto hidden lg:block">
            <BigRosette
              risks={props.risks}
              isUpcoming={props.isUpcoming ?? areAllRisksUpcoming}
              isUnderReview={props.isUnderReview}
            />
          </div>
        )}
      </header>
      <HorizontalSeparator className="hidden md:mt-6 md:block" />
    </>
  )
}
