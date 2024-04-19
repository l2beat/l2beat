import {
  ScalingProjectPurpose,
  StageConfig,
  WarningWithSentiment,
} from '@l2beat/config'
import { pluralize } from '@l2beat/shared-pure'
import React from 'react'

import { UpcomingBadge } from '../../../components/badge/UpcomingBadge'
import {
  TokenBreakdown,
  TokenBreakdownProps,
} from '../../../components/breakdown/TokenBreakdown'
import { DetailsHeader } from '../../../components/header/DetailsHeader'
import { ProjectSummaryStat } from '../../../components/header/ProjectSummary'
import { StatWithChange } from '../../../components/header/stats/StatWithChange'
import { TvlStats } from '../../../components/header/TvlSummary'
import { InfoIcon } from '../../../components/icons'
import { StageBadge } from '../../../components/stages/StageBadge'
import { StageTooltip } from '../../../components/stages/StageTooltip'
import { TypeCell } from '../../../components/table/TypeCell'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/tooltip/Tooltip'
import { RiskValues } from '../../../utils/risks/types'
import { ProjectLink } from '../types'

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
  tvlWarning?: WarningWithSentiment
  risks: RiskValues
  links: ProjectLink[]
  stage: StageConfig
  isArchived?: boolean
  isUpcoming?: boolean
  isLayer3?: boolean
  isRiskRosetteUnderReview?: boolean
  isImplementationUnderReview: boolean
  isUnderReview?: boolean
  warning?: string | { text: string; href: string }
  hostChain?: string
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const summary: ProjectSummaryStat[] = [
    {
      title: 'Tokens',
      value:
        props.isUpcoming || !props.tvlBreakdown || props.tvlBreakdown.empty ? (
          <UpcomingBadge />
        ) : (
          <TokenBreakdown {...props.tvlBreakdown} />
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

  if (props.hostChain) {
    summary.push({
      title: 'Host Chain',
      value: props.hostChain,
    })
  }

  return (
    <DetailsHeader
      type={props.isLayer3 ? 'layer3' : 'layer2'}
      title={props.title}
      description={props.description}
      icon={props.icon}
      stats={{ summary, l2Tvl: props.tvlStats }}
      risks={props.risks}
      links={props.links}
      warning={props.warning}
      tvlBreakdownHref={props.tvlBreakdownHref}
      tvlWarning={props.tvlWarning}
      showTvlBreakdown={
        props.showTvlBreakdown &&
        !props.isUpcoming &&
        props.tvlBreakdown &&
        !props.tvlBreakdown.empty
      }
      isUpcoming={props.isUpcoming}
      isArchived={props.isArchived}
      isUnderReview={props.isUnderReview}
      isImplementationUnderReview={props.isImplementationUnderReview}
      isRiskRosetteUnderReview={props.isRiskRosetteUnderReview}
    />
  )
}
