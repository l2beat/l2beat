import {
  Layer2TVLWarning,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import { pluralize } from '@l2beat/shared-pure'
import React from 'react'

import { UpcomingBadge } from '../../../../components/badge/UpcomingBadge'
import { DetailsHeader } from '../../../../components/header/DetailsHeader'
import { ProjectSummaryStat } from '../../../../components/header/ProjectSummary'
import { StatWithChange } from '../../../../components/header/stats/StatWithChange'
import { TvlStats } from '../../../../components/header/TvlSummary'
import { InfoIcon, ProjectLink } from '../../../../components/icons'
import { StageBadge } from '../../../../components/stages/StageBadge'
import { StageTooltip } from '../../../../components/stages/StageTooltip'
import { TypeCell } from '../../../../components/table/TypeCell'
import {
  TokenBreakdown,
  TokenBreakdownProps,
} from '../../../../components/TokenBreakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'
import { RiskValues } from '../../../../utils/risks/types'

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
  tvlBreakdown: TokenBreakdownProps | undefined
  showTvlBreakdown: boolean
  tvlBreakdownHref: string
  tvlWarning?: Layer2TVLWarning
  risks: RiskValues
  links: ProjectLink[]
  stage: StageConfig
  isArchived?: boolean
  isUpcoming?: boolean
  isLayer3?: boolean
  isUnderReview?: boolean
  showProjectUnderReview?: boolean
  warning?: string | { text: string; href: string }
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const summary: ProjectSummaryStat[] = [
    {
      title: 'Tokens',
      value:
        !props.isUpcoming && props.tvlBreakdown ? (
          <TokenBreakdown {...props.tvlBreakdown} />
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
                <Tooltip className="inline-block px-2">
                  <TooltipTrigger>
                    <InfoIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <StageTooltip stageConfig={props.stage} />
                  </TooltipContent>
                </Tooltip>
              </span>
            ),
          },
        ]
      : []),
    {
      title: 'Type',
      value: <TypeCell>{props.technology}</TypeCell>,
    },
    {
      title: pluralize(props.purposes.length, 'Purpose'),
      value: props.purposes.join(', '),
    },
  ]

  return (
    <DetailsHeader
      type="layer2"
      title={props.title}
      description={props.description}
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
      tvlWarning={props.tvlWarning}
      showTvlBreakdown={
        props.isUpcoming || props.isLayer3 ? false : props.showTvlBreakdown
      }
    />
  )
}
