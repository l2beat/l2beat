import { StageConfig } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { UpcomingBadge } from '../../../components/badge/UpcomingBadge'
import { DetailsHeader } from '../../../components/header/DetailsHeader'
import { StatWithChange } from '../../../components/header/stats/StatWithChange'
import { SummaryStat } from '../../../components/header/Summary'
import { InfoIcon, ProjectLink } from '../../../components/icons'
import { StageBadge } from '../../../components/stages/StageBadge'
import { StageTooltip } from '../../../components/stages/StageTooltip'
import { TechnologyCell } from '../../../components/table/TechnologyCell'
import {
  TVLBreakdown,
  TVLBreakdownProps,
} from '../../../components/TVLBreakdown'
import { RiskValues } from '../../../utils/risks/types'

export interface ProjectHeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  tvl?: string
  tvlWeeklyChange?: string
  tpsDaily?: string
  tpsWeeklyChange?: string
  transactionMonthlyCount?: string
  purpose: string
  technology: string
  tvlBreakdown: TVLBreakdownProps | undefined
  risks: RiskValues
  links: ProjectLink[]
  stagesEnabled?: boolean
  stage?: StageConfig
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  showProjectUnderReview?: boolean
  warning?: string | { text: string; href: string }
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const stats: SummaryStat[] = [
    {
      title: 'Total value locked',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago.',
      value:
        !props.isUpcoming && props.tvl && props.tvlWeeklyChange ? (
          <StatWithChange
            className="font-bold"
            stat={props.tvl}
            change={props.tvlWeeklyChange}
          />
        ) : (
          <UpcomingBadge />
        ),
    },
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
    ...(props.stagesEnabled && props.stage
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
      stagesEnabled={props.stagesEnabled}
      title={props.title}
      icon={props.icon}
      stats={stats}
      risks={props.risks}
      links={props.links}
      isUpcoming={props.isUpcoming}
      isUnderReview={props.isUnderReview}
      isArchived={props.isArchived}
      showProjectUnderReview={props.showProjectUnderReview}
      warning={props.warning}
    />
  )
}
