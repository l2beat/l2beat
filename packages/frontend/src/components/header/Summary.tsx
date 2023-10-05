import React from 'react'

import { ProjectLink } from '../icons'
import { DesktopProjectLinks } from './DesktopProjectLinks'
import { MobileProjectLinks } from './MobileProjectLinks'
import { ProjectSummary, ProjectSummaryStat } from './ProjectSummary'
import { TvlStats, TvlSummary } from './TvlSummary'

interface SummaryProps {
  type: 'bridge' | 'layer2'
  stats: FullSummaryStats
  links: ProjectLink[]
  detailedTvlEnabled?: boolean
  isUpcoming?: boolean
  tvlBreakdownHref?: string
  showTvlBreakdown?: boolean
}

export interface FullSummaryStats {
  summary: ProjectSummaryStat[]
  l2Tvl?: TvlStats
}

export function Summary(props: SummaryProps) {
  return (
    <>
      <div className="my-2 hidden w-full md:block">
        <DesktopProjectLinks projectLinks={props.links} />
      </div>
      <div className="grid w-full gap-4 md:grid-cols-3">
        <TvlSummary
          stats={props.stats.l2Tvl}
          detailedTvlEnabled={props.detailedTvlEnabled}
          tvlBreakdownHref={props.tvlBreakdownHref}
          showTvlBreakdown={props.showTvlBreakdown}
        />
        <ProjectSummary
          stats={props.stats.summary}
          type={props.type}
          detailedTvlEnabled={!!props.detailedTvlEnabled}
          className="md:col-span-2"
        />
      </div>
      <div className="w-full px-4 md:hidden md:px-0">
        <MobileProjectLinks projectLinks={props.links} />
      </div>
    </>
  )
}
