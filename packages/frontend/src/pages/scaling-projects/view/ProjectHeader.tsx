import React from 'react'

import { DetailsHeader } from '../../../components/header/DetailsHeader'
import { StatWithChange } from '../../../components/header/stats/StatWithChange'
import { NoDataCell } from '../../../components/table/NoDataCell'
import { TechnologyCell } from '../../../components/table/TechnologyCell'

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
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const stats = [
    {
      title: 'Total value locked',
      value:
        props.tvl && props.tvlWeeklyChange ? (
          <StatWithChange
            className="font-bold"
            stat={props.tvl}
            change={props.tvlWeeklyChange}
          />
        ) : (
          <NoDataCell />
        ),
    },
    {
      title: 'Daily TPS',
      value:
        props.tpsDaily && props.tpsWeeklyChange ? (
          <StatWithChange
            stat={props.tpsDaily}
            change={props.tpsWeeklyChange}
          />
        ) : (
          <NoDataCell />
        ),
    },
    {
      title: '30d transaction count',
      value: props.transactionMonthlyCount ?? <NoDataCell />,
    },
    {
      title: 'Purpose',
      value: props.purpose,
    },
    {
      title: 'Technology',
      value: <TechnologyCell>{props.technology}</TechnologyCell>,
    },
  ]

  return <DetailsHeader title={props.title} icon={props.icon} stats={stats} />
}
