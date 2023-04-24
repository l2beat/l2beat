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
import { TechnologySectionProps } from '../../../components/project/TechnologySection'
import { getContractSection } from '../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../utils/project/getPermissionsSection'
import { getRiskValues } from '../../../utils/risks/values'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  project: Layer2,
  verificationStatus: VerificationStatus,
  chart: ChartProps,
): ProjectDetailsProps {
  const isUpcoming = project.isUpcoming
  const { incomplete, sections: technologySections } =
    getTechnologyOverview(project)
  const permissionsSection = getPermissionsSection(project, verificationStatus)
  const sections: Section[] = []

  sections.push({
    type: 'ChartSection',
    props: { ...chart, id: 'chart', title: 'Chart' },
  })

  if (!isUpcoming && project.milestones && !isEmpty(project.milestones)) {
    sections.push({
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
    sections.push({
      type: 'KnowledgeNuggetsSection',
      props: {
        knowledgeNuggets: project.knowledgeNuggets,
        id: 'knowledge-nuggets',
        title: 'Knowledge Nuggets',
      },
    })
  }

  sections.push({
    type: 'DescriptionSection',
    props: getDescriptionSection(project, verificationStatus),
  })

  if (!isUpcoming) {
    sections.push({
      type: 'RiskAnalysisSection',
      props: {
        riskValues: getRiskValues(project.riskView),
        id: 'risk-analysis',
        title: 'Risk Analysis',
      },
    })

    technologySections.forEach((section) =>
      sections.push({
        type: 'TechnologySection',
        props: {
          items: section.items,
          id: section.id,
          title: section.title,
        },
      }),
    )

    if (permissionsSection) {
      sections.push({
        type: 'PermissionsSection',

        props: {
          ...permissionsSection,
          id: 'permissions',
          title: 'Permissions',
        },
      })
    }

    sections.push({
      type: 'ContractsSection',
      props: getContractSection(project, verificationStatus),
    })
  }

  return { incomplete, isUpcoming, sections }
}

export type Section =
  | ChartSection
  | DescriptionSection
  | MilestonesSection
  | KnowledgeNuggetsSection
  | RiskAnalysisSection
  | TechnologySection
  | PermissionsSection
  | ContractsSection

interface ChartSection {
  type: 'ChartSection'
  props: ChartProps
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
