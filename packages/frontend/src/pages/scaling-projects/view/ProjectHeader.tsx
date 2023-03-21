import { Layer2Rating } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { DetailsHeader, Link } from '../../../components/header/DetailsHeader'
import { StatWithChange } from '../../../components/header/stats/StatWithChange'
import { RatingBadge } from '../../../components/rating/Badge'
import { RatingTooltipPopup } from '../../../components/rating/TooltipPopup'
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
  ratingEntry?: false | Layer2Rating
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
          <NoDataCell />
        ),
    },
    {
      title: 'Breakdown',
      value: !props.isUpcoming ? (
        <TVLBreakdown {...props.tvlBreakdown} />
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
      title: '30D tx count',
      value: props.transactionMonthlyCount ?? <NoDataCell />,
    },
    ...(props.ratingEntry
      ? [
          {
            title: 'Rating',
            value: (
              <span
                className="Tooltip"
                title={renderToStaticMarkup(
                  <RatingTooltipPopup item={props.ratingEntry} />,
                )}
              >
                <RatingBadge
                  category={props.ratingEntry.category.score}
                  modifier={props.ratingEntry.modifier?.score}
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
