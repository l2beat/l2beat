import { Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared'
import { isEmpty } from 'lodash'

import { ChartProps } from '../../../components'
import { ChartSectionProps } from '../../../components/project/ChartSection'
import { ContractsSectionProps } from '../../../components/project/ContractsSection'
import { DescriptionSectionProps } from '../../../components/project/DescriptionSection'
import { KnowledgeNuggetsProps } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from '../../../components/project/MilestonesSection'
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
  const items: ScalingDetailsItem[] = []

  items.push({
    type: 'ChartSection',
    props: { ...chart, id: 'chart', title: 'Chart' },
  })

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

  if (
    !isUpcoming &&
    project.knowledgeNuggets &&
    !isEmpty(project.knowledgeNuggets)
  ) {
    items.push({
      type: 'KnowledgeNuggetsSection',
      props: {
        knowledgeNuggets: project.knowledgeNuggets,
        id: 'knowledge-nuggets',
        title: 'Knowledge Nuggets',
      },
    })
  }

  items.push({
    type: 'DescriptionSection',
    props: getDescriptionSection(project, verificationStatus),
  })

  if (!isUpcoming) {
    items.push({
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
        excludeFromNavigation: true,
        props: incomplete,
      })
    }

    technologySections.forEach((section) =>
      items.push({
        type: 'TechnologySection',
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
        props: {
          ...permissionsSection,
          id: 'permissions',
          title: 'Permissions',
        },
      })
    }

    items.push({
      type: 'ContractsSection',
      props: getContractSection(project, verificationStatus),
    })
  } else {
    items.push({
      type: 'UpcomingDisclaimer',
      excludeFromNavigation: true,
    })
  }

  return { incomplete, isUpcoming, items }
}

export type ScalingDetailsItem = { excludeFromNavigation?: boolean } & (
  | ScalingDetailsSection
  | NonSectionElement
)

export type ScalingDetailsSection =
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
  props: ChartSectionProps
}
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

interface RiskAnalysisSection {
  type: 'RiskAnalysisSection'
  props: RiskAnalysisProps
}

interface TechnologyIncompleteNote {
  type: 'TechnologyIncompleteNote'
  props: TechnologyIncompleteProps
}
interface TechnologySection {
  type: 'TechnologySection'
  props: TechnologySectionProps
}

interface PermissionsSection {
  type: 'PermissionsSection'
  props: PermissionsSectionProps
}

interface ContractsSection {
  type: 'ContractsSection'
  props: ContractsSectionProps
}

interface UpcomingDisclaimer {
  type: 'UpcomingDisclaimer'
}
