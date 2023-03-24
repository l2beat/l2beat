import { Layer2Maturity } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { DetailsHeader, Link } from '../../../components/header/DetailsHeader'
import { StatWithChange } from '../../../components/header/stats/StatWithChange'
import { MaturityBadge } from '../../../components/maturity/Badge'
import { MaturityTooltipPopup } from '../../../components/maturity/TooltipPopup'
import { NoDataCell } from '../../../components/table/NoDataCell'
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
  tvlBreakdown: TVLBreakdownProps
  risks: RiskValues
  links: Link[]
  maturityEntry?: false | Layer2Maturity
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
          <NoDataCell isUpcoming={props.isUpcoming} />
        ),
    },
    {
      title: 'Breakdown',
      value: !props.isUpcoming ? (
        <TVLBreakdown {...props.tvlBreakdown} />
      ) : (
        <NoDataCell isUpcoming={props.isUpcoming} />
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
          <NoDataCell isUpcoming={props.isUpcoming} />
        ),
    },
    {
      title: '30D tx count',
      value: props.transactionMonthlyCount ?? (
        <NoDataCell isUpcoming={props.isUpcoming} />
      ),
    },
    ...(props.maturityEntry
      ? [
          {
            title: 'Maturity',
            value: (
              <span
                className="Tooltip"
                title={renderToStaticMarkup(
                  <MaturityTooltipPopup item={props.maturityEntry} />,
                )}
              >
                <MaturityBadge
                  category={props.maturityEntry.category.score}
                  modifier={props.maturityEntry.modifier?.score}
                  small
                />
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
      title={props.title}
      icon={props.icon}
      stats={stats}
      risks={props.risks}
      links={props.links}
      isUpcoming={props.isUpcoming}
      isArchived={props.isArchived}
      isSummary
    />
  )
}
