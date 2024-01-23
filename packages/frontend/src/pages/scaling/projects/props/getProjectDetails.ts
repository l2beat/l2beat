import { Layer2 } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'

import { ChartProps } from '../../../../components'
import { getContractSection } from '../../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../../utils/project/getPermissionsSection'
import {
  getProjectEditLink,
  getProjectIssueLink,
} from '../../../../utils/project/links'
import { getRiskValues } from '../../../../utils/risks/values'
import {
  ProjectDetailsChartSection,
  ProjectDetailsContractsSection,
  ProjectDetailsDetailedDescriptionSection,
  ProjectDetailsKnowledgeNuggetsSection,
  ProjectDetailsMilestonesSection,
  ProjectDetailsPermissionsSection,
  ProjectDetailsRiskAnalysisSection,
  ProjectDetailsStageSection,
  ProjectDetailsStateDerivationSection,
  ProjectDetailsStateValidationSection,
  ProjectDetailsTechnologyIncompleteNote,
  ProjectDetailsTechnologySection,
  ProjectDetailsUpcomingDisclaimer,
} from '../../../types'
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
    props: {
      ...chart,
      id: 'chart',
      title: 'Chart',
      sectionOrder: items.length + 1,
    },
  })

  if (!isUpcoming && project.milestones && !isEmpty(project.milestones)) {
    items.push({
      type: 'MilestonesSection',
      props: {
        milestones: project.milestones,
        id: 'milestones',
        title: 'Milestones',
        sectionOrder: items.length + 1,
      },
    })
  }

  if (project.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        sectionOrder: items.length + 1,
        description: project.display.description,
        detailedDescription: project.display.detailedDescription,
      },
    })
  }

  if (!isUpcoming) {
    items.push({
      type: 'RiskAnalysisSection',
      props: {
        id: 'risk-analysis',
        title: 'Risk analysis',
        sectionOrder: items.length + 1,
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
          sectionOrder: items.length + 1,
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
        sectionOrder: items.length + 1,
        isUnderReview: technologySection.isUnderReview,
      },
    })

    if (project.stateDerivation) {
      items.push({
        type: 'StateDerivationSection',
        props: {
          id: 'state-derivation',
          title: 'State derivation',
          sectionOrder: items.length + 1,
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
          sectionOrder: items.length + 1,
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
          sectionOrder: items.length + 1,
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
          sectionOrder: items.length + 1,
        },
      })
    }

    items.push({
      type: 'ContractsSection',
      props: {
        ...getContractSection(
          project,
          verificationStatus,
          manuallyVerifiedContracts,
        ),
        sectionOrder: items.length + 1,
      },
    })

    if (project.knowledgeNuggets && !isEmpty(project.knowledgeNuggets)) {
      items.push({
        type: 'KnowledgeNuggetsSection',
        props: {
          knowledgeNuggets: project.knowledgeNuggets,
          id: 'knowledge-nuggets',
          title: 'Knowledge nuggets',
          sectionOrder: items.length + 1,
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
  | ProjectDetailsNonSectionElement
)

type ProjectDetailsNonSectionElement =
  | ProjectDetailsTechnologyIncompleteNote
  | ProjectDetailsUpcomingDisclaimer

export type ScalingDetailsSection =
  | ProjectDetailsChartSection
  | ProjectDetailsDetailedDescriptionSection
  | ProjectDetailsMilestonesSection
  | ProjectDetailsKnowledgeNuggetsSection
  | ProjectDetailsRiskAnalysisSection
  | ProjectDetailsTechnologySection
  | ProjectDetailsStateDerivationSection
  | ProjectDetailsStateValidationSection
  | ProjectDetailsPermissionsSection
  | ProjectDetailsContractsSection
  | ProjectDetailsStageSection
