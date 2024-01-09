import { Layer2 } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'

import { ChartProps } from '../../../../components'
import { ChartSectionProps } from '../../../../components/project/ChartSection'
import { ContractsSectionProps } from '../../../../components/project/ContractsSection'
import { DetailedDescriptionSectionProps } from '../../../../components/project/DetailedDescriptionSection'
import { KnowledgeNuggetsProps } from '../../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from '../../../../components/project/MilestonesSection'
import { PermissionsSectionProps } from '../../../../components/project/PermissionsSection'
import { RiskAnalysisProps } from '../../../../components/project/RiskAnalysis'
import { StageSectionProps } from '../../../../components/project/StageSection'
import { StateDerivationSectionProps } from '../../../../components/project/StateDerivationSection'
import { StateValidationSectionProps } from '../../../../components/project/StateValidationSection'
import { TechnologyIncompleteProps } from '../../../../components/project/TechnologyIncomplete'
import { TechnologySectionProps } from '../../../../components/project/TechnologySection'
import { getContractSection } from '../../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../../utils/project/getPermissionsSection'
import {
  getProjectEditLink,
  getProjectIssueLink,
} from '../../../../utils/project/links'
import { getRiskValues } from '../../../../utils/risks/values'
import { getDetailedDescriptionSection } from './getDetailedDescriptionSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  project: Layer2,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  chart: ChartProps,
) {
  const isUpcoming = project.isUpcoming
  const { incomplete, sections: technologySections } =
    getTechnologyOverview(project)
  const permissionsSection = getPermissionsSection(
    project,
    verificationStatus,
    manuallyVerifiedContracts,
  )
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

  if (project.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: getDetailedDescriptionSection(project),
    })
  }

  if (!isUpcoming) {
    items.push({
      type: 'RiskAnalysisSection',
      props: {
        id: 'risk-analysis',
        title: 'Risk analysis',
        riskValues: getRiskValues(project.riskView),
        warning: project.display.warning,
        redWarning: project.display.redWarning,
        isVerified: verificationStatus.projects[project.id.toString()],
        isUnderReview: project.isUnderReview,
      },
    })

    if (project.stage.stage !== 'NotApplicable') {
      items.push({
        type: 'StageSection',
        props: {
          stageConfig: project.stage,
          name: project.display.name,
          icon: `/icons/${project.display.slug}.png`,
          type: project.display.category,
          id: 'stage',
          title: 'Rollup stage',
          isUnderReview: project.isUnderReview,
        },
      })
    }

    if (incomplete) {
      items.push({
        type: 'TechnologyIncompleteNote',
        excludeFromNavigation: true,
        props: incomplete,
      })
    }

    /* We want state derivation to be after technology section
       so we split the technology sections into two arrays
       and add state derivation in between */
    const technologySection = technologySections[0]
    items.push({
      type: 'TechnologySection',
      props: {
        items: technologySection.items,
        id: technologySection.id,
        title: technologySection.title,
        isUnderReview: technologySection.isUnderReview,
      },
    })

    if (project.stateDerivation) {
      items.push({
        type: 'StateDerivationSection',
        props: {
          id: 'state-derivation',
          title: 'State derivation',
          ...project.stateDerivation,
        },
      })
    }

    if (project.stateValidation) {
      items.push({
        type: 'StateValidationSection',
        props: {
          id: 'state-validation',
          title: 'State validation',
          stateValidation: project.stateValidation,
        },
      })
    }

    technologySections.slice(1).forEach((section) =>
      items.push({
        type: 'TechnologySection',
        props: {
          items: section.items,
          id: section.id,
          title: section.title,
          isUnderReview: section.isUnderReview,
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
      props: getContractSection(
        project,
        verificationStatus,
        manuallyVerifiedContracts,
      ),
    })

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
    incomplete,
    isUpcoming,
  }
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
  | StateDerivationSection
  | StateValidationSection
  | PermissionsSection
  | ContractsSection
  | StageSection

type NonSectionElement = TechnologyIncompleteNote | UpcomingDisclaimer

interface ChartSection {
  type: 'ChartSection'
  props: ChartSectionProps
}
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

interface RiskAnalysisSection {
  type: 'RiskAnalysisSection'
  props: RiskAnalysisProps
}

interface StageSection {
  type: 'StageSection'
  props: StageSectionProps
}

interface TechnologyIncompleteNote {
  type: 'TechnologyIncompleteNote'
  props: TechnologyIncompleteProps
}
interface TechnologySection {
  type: 'TechnologySection'
  props: TechnologySectionProps
}

interface StateDerivationSection {
  type: 'StateDerivationSection'
  props: StateDerivationSectionProps
}

interface StateValidationSection {
  type: 'StateValidationSection'
  props: StateValidationSectionProps
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
