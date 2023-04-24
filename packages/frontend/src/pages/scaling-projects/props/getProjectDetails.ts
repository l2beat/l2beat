import { Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared'
import { isEmpty } from 'lodash'

import { ChartProps } from '../../../components'
import { ContractsSectionProps } from '../../../components/project/ContractsSection'
import { DescriptionSectionProps } from '../../../components/project/DescriptionSection'
import { KnowledgeNuggetsProps } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from '../../../components/project/Milestones'
import { PermissionsSectionProps } from '../../../components/project/PermissionsSection'
import { RiskAnalysisProps } from '../../../components/project/RiskAnalysis'
import { TechnologyIncompleteProps } from '../../../components/project/TechnologyIncomplete'
import { TechnologySectionProps } from '../../../components/project/TechnologySection'
import { getContractSection } from '../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../utils/project/getPermissionsSection'
import { getRiskValues } from '../../../utils/risks/values'
import { getDescriptionSection } from './getDescriptionSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  project: Layer2,
  verificationStatus: VerificationStatus,
  chart: ChartProps,
) {
  const isUpcoming = project.isUpcoming
  const { incomplete, sections: technologySections } =
    getTechnologyOverview(project)
  const permissionsSection = getPermissionsSection(project, verificationStatus)
  const items: ProjectDetailsItem[] = []

  items.push({
    isSection: true,
    type: 'ChartSection',
    props: { ...chart, id: 'chart', title: 'Chart' },
  })

  if (!isUpcoming && project.milestones && !isEmpty(project.milestones)) {
    items.push({
      isSection: true,
      type: 'MilestonesSection',
      props: {
        milestones: project.milestones,
        id: 'milestones',
        title: 'Milestones',
      },
    })
  }

  if (
    !isUpcoming &&
    project.knowledgeNuggets &&
    !isEmpty(project.knowledgeNuggets)
  ) {
    items.push({
      isSection: true,
      type: 'KnowledgeNuggetsSection',
      props: {
        knowledgeNuggets: project.knowledgeNuggets,
        id: 'knowledge-nuggets',
        title: 'Knowledge Nuggets',
      },
    })
  }

  items.push({
    isSection: true,
    type: 'DescriptionSection',
    props: getDescriptionSection(project, verificationStatus),
  })

  if (!isUpcoming) {
    items.push({
      isSection: true,
      type: 'RiskAnalysisSection',
      props: {
        riskValues: getRiskValues(project.riskView),
        id: 'risk-analysis',
        title: 'Risk Analysis',
      },
    })

    if (incomplete) {
      items.push({
        type: 'TechnologyIncompleteNote',
        isSection: false,
        props: incomplete,
      })
    }

    technologySections.forEach((section) =>
      items.push({
        type: 'TechnologySection',
        isSection: true,
        props: {
          items: section.items,
          id: section.id,
          title: section.title,
        },
      }),
    )

    if (permissionsSection) {
      items.push({
        type: 'PermissionsSection',
        isSection: true,
        props: {
          ...permissionsSection,
          id: 'permissions',
          title: 'Permissions',
        },
      })
    }

    items.push({
      type: 'ContractsSection',
      isSection: true,
      props: getContractSection(project, verificationStatus),
    })
  }

  return { incomplete, isUpcoming, items }
}

export type ProjectDetailsItem = ProjectDetailsSection | NonSectionElement

export type ProjectDetailsSection =
  | ChartSection
  | DescriptionSection
  | MilestonesSection
  | KnowledgeNuggetsSection
  | RiskAnalysisSection
  | TechnologySection
  | PermissionsSection
  | ContractsSection

type NonSectionElement = TechnologyIncompleteNote | UpcomingDisclaimer

interface ChartSection {
  type: 'ChartSection'
  isSection: true
  props: ChartProps
}
interface DescriptionSection {
  type: 'DescriptionSection'
  isSection: true
  props: DescriptionSectionProps
}

interface MilestonesSection {
  type: 'MilestonesSection'
  isSection: true
  props: MilestonesSectionProps
}

interface KnowledgeNuggetsSection {
  type: 'KnowledgeNuggetsSection'
  isSection: true
  props: KnowledgeNuggetsProps
}

interface RiskAnalysisSection {
  type: 'RiskAnalysisSection'
  isSection: true
  props: RiskAnalysisProps
}

interface TechnologyIncompleteNote {
  isSection: false
  type: 'TechnologyIncompleteNote'
  props: TechnologyIncompleteProps
}
interface TechnologySection {
  type: 'TechnologySection'
  isSection: true
  props: TechnologySectionProps
}

interface PermissionsSection {
  type: 'PermissionsSection'
  isSection: true
  props: PermissionsSectionProps
}

interface ContractsSection {
  type: 'ContractsSection'
  isSection: true
  props: ContractsSectionProps
}

interface UpcomingDisclaimer {
  isSection: false
  type: 'UpcomingDisclaimer'
}
