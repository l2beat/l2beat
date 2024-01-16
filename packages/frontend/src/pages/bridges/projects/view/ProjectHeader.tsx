import { ScalingProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { NoDataBadge } from '../../../../components/badge/NoDataBadge'
import { DetailsHeader } from '../../../../components/header/DetailsHeader'
import { ProjectSummaryStat } from '../../../../components/header/ProjectSummary'
import { StatWithChange } from '../../../../components/header/stats/StatWithChange'
import { ProjectLink } from '../../../../components/icons'
import { RiskCell } from '../../../../components/table/RiskCell'

export interface ProjectHeaderProps {
  title: string
  titleClassName?: string
  description: string | undefined
  icon?: string
  tvl?: string
  tvlWeeklyChange?: string
  destination: ScalingProjectRiskViewEntry
  validatedBy?: ScalingProjectRiskViewEntry
  type: string
  links: ProjectLink[]
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  showProjectUnderReview?: boolean
  warning?: string
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const stats: ProjectSummaryStat[] = [
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
          <NoDataBadge />
        ),
    },
    {
      title: 'Destination',
      value: <RiskCell item={props.destination} />,
    },
    {
      title: 'Validated by',
      value: <RiskCell item={props.validatedBy} />,
    },
    { title: 'Type', value: props.type },
  ]

  return (
    <DetailsHeader
      type="bridge"
      title={props.title}
      description={props.description}
      icon={props.icon}
      links={props.links}
      stats={{ summary: stats }}
      isArchived={props.isArchived}
      showProjectUnderReview={props.showProjectUnderReview}
      warning={props.warning}
    />
  )
}
