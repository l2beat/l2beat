import React from 'react'

import { UpcomingBadge } from '../../../components/badge/UpcomingBadge'
import { DetailsHeader } from '../../../components/header/DetailsHeader'
import { ProjectSummaryStat } from '../../../components/header/ProjectSummary'
import { ProjectLink } from '../../../components/icons'
import { TypeCell } from '../../../components/table/TypeCell'

export interface ProjectHeaderProps {
  title: string
  titleClassName?: string
  icon?: string
  purpose: string
  technology: string
  links: ProjectLink[]
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
      value: <UpcomingBadge />,
    },
    {
      title: 'Type',
      value: <TypeCell>{props.technology}</TypeCell>,
    },
    {
      title: 'Purpose',
      value: props.purpose,
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
      stats={{ summary }}
      links={props.links}
      isUpcoming={props.isUpcoming}
      isUnderReview={props.isUnderReview}
      showProjectUnderReview={props.showProjectUnderReview}
      warning={props.warning}
    />
  )
}
