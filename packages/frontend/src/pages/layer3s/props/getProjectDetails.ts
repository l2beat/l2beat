import { Layer3 } from '@l2beat/config'
import isEmpty from 'lodash/isEmpty'

import { DetailedDescriptionSectionProps } from '../../../components/project/DetailedDescriptionSection'
import { KnowledgeNuggetsProps } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from '../../../components/project/MilestonesSection'
import {
  getProjectEditLink,
  getProjectIssueLink,
} from '../../../utils/project/links'
import { getDetailedDescriptionSection } from './getDetailedDescriptionSection'

export function getProjectDetails(project: Layer3) {
  const isUpcoming = project.isUpcoming
  const items: ScalingDetailsItem[] = []

  if (!isUpcoming && project.milestones && !isEmpty(project.milestones)) {
    items.push({
      type: 'MilestonesSection',
      props: {
        milestones: project.milestones,
        id: 'milestones',
        title: 'Milestones',
      },
    })
  }

  if (project.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: getDetailedDescriptionSection(project),
    })
  }

  if (!isUpcoming) {
    if (project.knowledgeNuggets && !isEmpty(project.knowledgeNuggets)) {
      items.push({
        type: 'KnowledgeNuggetsSection',
        props: {
          knowledgeNuggets: project.knowledgeNuggets,
          id: 'knowledge-nuggets',
          title: 'Knowledge nuggets',
        },
      })
    }
  } else {
    items.push({
      type: 'UpcomingDisclaimer',
      excludeFromNavigation: true,
    })
  }

  return {
    items,
    editLink: getProjectEditLink(project),
    issueLink: getProjectIssueLink(project),
    isUpcoming,
  }
}

export type ScalingDetailsItem = { excludeFromNavigation?: boolean } & (
  | ScalingDetailsSection
  | NonSectionElement
)

export type ScalingDetailsSection =
  | DescriptionSection
  | MilestonesSection
  | KnowledgeNuggetsSection

type NonSectionElement = UpcomingDisclaimer

interface DescriptionSection {
  type: 'DetailedDescriptionSection'
  props: DetailedDescriptionSectionProps
}

interface MilestonesSection {
  type: 'MilestonesSection'
  props: MilestonesSectionProps
}

interface KnowledgeNuggetsSection {
  type: 'KnowledgeNuggetsSection'
  props: KnowledgeNuggetsProps
}

interface UpcomingDisclaimer {
  type: 'UpcomingDisclaimer'
}
