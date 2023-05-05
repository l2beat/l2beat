import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { NoDataBadge } from '../../../components/badge/NoDataBadge'
import { DetailsHeader } from '../../../components/header/DetailsHeader'
import { StatWithChange } from '../../../components/header/stats/StatWithChange'
import { ProjectLink } from '../../../components/icons'
import { RiskCell } from '../../../components/table/RiskCell'

export interface ProjectHeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  tvl?: string
  tvlWeeklyChange?: string
  destination: ProjectRiskViewEntry
  validatedBy?: ProjectRiskViewEntry
  type: string
  links: ProjectLink[]
  isArchived?: boolean
  isUpcoming?: boolean
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const stats = [
    {
      title: 'Total value locked',
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
      icon={props.icon}
      links={props.links}
      stats={stats}
      isArchived={props.isArchived}
    />
  )
}
