import { StageConfig } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { UpcomingBadge } from '../../../../components/badge/UpcomingBadge'
import { DetailsHeader } from '../../../../components/header/DetailsHeader'
import { ProjectSummaryStat } from '../../../../components/header/ProjectSummary'
import { StatWithChange } from '../../../../components/header/stats/StatWithChange'
import { TvlStats } from '../../../../components/header/TvlSummary'
import { InfoIcon, ProjectLink } from '../../../../components/icons'
import { StageBadge } from '../../../../components/stages/StageBadge'
import { StageTooltip } from '../../../../components/stages/StageTooltip'
import { TechnologyCell } from '../../../../components/table/TechnologyCell'
import {
  TVLBreakdown,
  TVLBreakdownProps,
} from '../../../../components/TVLBreakdown'
import { RiskValues } from '../../../../utils/risks/types'

export interface ProjectHeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  tvlStats?: TvlStats
  tpsDaily?: string
  tpsWeeklyChange?: string
  transactionMonthlyCount?: string
  purpose: string
  technology: string
  tvlBreakdown: TVLBreakdownProps | undefined
  showTvlBreakdown: boolean
  tvlBreakdownHref: string
  risks: RiskValues
  links: ProjectLink[]
  stage: StageConfig
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  showProjectUnderReview?: boolean
  warning?: string | { text: string; href: string }
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const summary: ProjectSummaryStat[] = [
    {
      title: 'Breakdown',
      value:
        !props.isUpcoming && props.tvlBreakdown ? (
          <TVLBreakdown {...props.tvlBreakdown} />
        ) : (
          <UpcomingBadge />
        ),
    },
    {
      title: 'Daily TPS',
      tooltip:
        'Transactions per second averaged over the past day displayed together with a percentage change compared to 7D ago.',
      value:
        props.tpsDaily && props.tpsWeeklyChange ? (
          <StatWithChange
            stat={props.tpsDaily}
            change={props.tpsWeeklyChange}
          />
        ) : (
          <UpcomingBadge />
        ),
    },
    {
      title: '30D tx count',
      value: props.transactionMonthlyCount ?? <UpcomingBadge />,
    },
    ...(props.stage.stage !== 'NotApplicable'
      ? [
          {
            title: 'Stage',
            value: (
              <span className="relative -top-0.5 flex items-center">
                <a href="#stage">
                  <StageBadge stage={props.stage.stage} big />
                </a>
                <span
                  className="Tooltip inline-block px-2"
                  title={renderToStaticMarkup(
                    <StageTooltip item={props.stage} />,
                  )}
                >
                  <InfoIcon />
                </span>
              </span>
            ),
          },
        ]
      : []),
    {
      title: 'Technology',
      value: <TechnologyCell>{props.technology}</TechnologyCell>,
    },
    {
      title: 'Purpose',
      value: props.purpose,
    },
  ]

  return (
    <DetailsHeader
      type="layer2"
      title={props.title}
      icon={props.icon}
      stats={{ summary, l2Tvl: props.tvlStats }}
      risks={props.risks}
      links={props.links}
      isUpcoming={props.isUpcoming}
      isUnderReview={props.isUnderReview}
      isArchived={props.isArchived}
      showProjectUnderReview={props.showProjectUnderReview}
      warning={props.warning}
      tvlBreakdownHref={props.tvlBreakdownHref}
      showTvlBreakdown={props.isUpcoming ? false : props.showTvlBreakdown}
    />
  )
}
