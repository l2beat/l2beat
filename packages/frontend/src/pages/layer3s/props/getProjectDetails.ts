import { Layer3 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'

import { DescriptionSectionProps } from '../../../components/project/DescriptionSection'
import { KnowledgeNuggetsProps } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from '../../../components/project/MilestonesSection'
import { getDescriptionSection } from './getDescriptionSection'

export function getProjectDetails(
  project: Layer3,
  verificationStatus: VerificationStatus,
) {
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

  items.push({
    type: 'DescriptionSection',
    props: getDescriptionSection(project, verificationStatus),
  })

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

  return { isUpcoming, items }
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
  type: 'DescriptionSection'
  props: DescriptionSectionProps
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
