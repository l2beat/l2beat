import { ScalingProjectPurpose } from '@l2beat/config'
import React from 'react'

import { UpcomingBadge } from '../../../components/badge/UpcomingBadge'
import { DetailsHeader } from '../../../components/header/DetailsHeader'
import { ProjectSummaryStat } from '../../../components/header/ProjectSummary'
import { StatWithChange } from '../../../components/header/stats/StatWithChange'
import { TvlStats } from '../../../components/header/TvlSummary'
import { ProjectLink } from '../../../components/icons'
import { TypeCell } from '../../../components/table/TypeCell'
import {
  TVLBreakdown,
  TVLBreakdownProps,
} from '../../../components/TVLBreakdown'
import { pluralize } from '../../../utils/pluralize'
import { RiskValues } from '../../../utils/risks/types'

export interface ProjectHeaderProps {
  title: string
  titleClassName?: string
  description: string
  icon?: string
  tvlStats: TvlStats
  tpsDaily?: string
  tpsWeeklyChange?: string
  transactionMonthlyCount?: string
  purposes: ScalingProjectPurpose[]
  technology: string
  tvlBreakdown: TVLBreakdownProps | undefined
  showTvlBreakdown: boolean
  tvlBreakdownHref: string
  risks: RiskValues
  links: ProjectLink[]
  isArchived?: boolean
  isUpcoming?: boolean
  isLayer3?: boolean
  isUnderReview?: boolean
  showProjectUnderReview?: boolean
  warning?: string | { text: string; href: string }
  hostChain?: string
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const summary: ProjectSummaryStat[] = [
    {
      title: 'Breakdown',
      value:
        props.isUpcoming || !props.tvlBreakdown || props.tvlBreakdown.empty ? (
          <UpcomingBadge />
        ) : (
          <TVLBreakdown {...props.tvlBreakdown} />
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
    {
      title: 'Type',
      value: <TypeCell>{props.technology}</TypeCell>,
    },
    {
      title: pluralize(props.purposes.length, 'Purpose'),
      value: props.purposes.join(', '),
    },
    {
      title: 'Host Chain',
      value: props.hostChain,
    },
  ]

  return (
    <DetailsHeader
      type="layer3"
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
      description={props.description}
      tvlBreakdownHref={props.tvlBreakdownHref}
      showTvlBreakdown={
        props.showTvlBreakdown &&
        props.tvlBreakdown &&
        !props.tvlBreakdown.empty
      }
    />
  )
}
