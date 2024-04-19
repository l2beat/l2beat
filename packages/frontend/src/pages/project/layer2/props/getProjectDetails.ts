import { Layer2 } from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'

import { ProjectDetailsCharts } from '../../../../utils/project/getCharts'
import { getContractSection } from '../../../../utils/project/getContractSection'
import { getDiagramImage } from '../../../../utils/project/getDiagramImage'
import { getPermissionsSection } from '../../../../utils/project/getPermissionsSection'
import { getRiskSection } from '../../../../utils/project/getRiskSection'
import { getRiskValues } from '../../../../utils/risks/values'
import { ProjectDetailsSection } from '../../types'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  project: Layer2,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
  charts: ProjectDetailsCharts,
) {
  const isUpcoming = project.isUpcoming
  const technologySections = getTechnologyOverview(project)
  const permissionsSection = getPermissionsSection(
    project,
    verificationStatus,
    manuallyVerifiedContracts,
  )
  const riskSection = getRiskSection(project, verificationStatus)

  const items: ProjectDetailsSection[] = []

  if (charts.tvl) {
    items.push({
      type: 'ChartSection',
      props: {
        ...charts.tvl,
        id: 'tvl',
        title: 'Value Locked',
      },
    })
  }

  if (charts.activity) {
    items.push({
      type: 'ChartSection',
      props: {
        ...charts.activity,
        id: 'activity',
        title: 'Activity',
      },
    })
  }

  if (charts.costs) {
    items.push({
      type: 'ChartSection',
      props: {
        ...charts.costs,
        id: 'costs',
        title: 'Costs',
      },
    })
  }

  if (!isUpcoming && project.milestones && !isEmpty(project.milestones)) {
    items.push({
      type: 'MilestonesSection',
      props: {
        id: 'milestones',
        title: 'Milestones',
        milestones: project.milestones,
      },
    })
  }

  if (project.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: project.display.description,
        detailedDescription: project.display.detailedDescription,
      },
    })
  }

  if (riskSection.riskGroups.length > 0) {
    items.push({
      type: 'RiskSection',
      props: riskSection,
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
          isUnderReview: project.isUnderReview,
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
          image: getDiagramImage('state-validation', project.display.slug),
          stateValidation: project.stateValidation,
          isUnderReview: project.isUnderReview,
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

    if (project.upgradesAndGovernance) {
      items.push({
        type: 'UpgradesAndGovernanceSection',
        props: {
          id: 'upgrades-and-governance',
          title: 'Upgrades & Governance',
          content: project.upgradesAndGovernance,
          image: getDiagramImage(
            'upgrades-and-governance',
            project.display.slug,
          ),
          isUnderReview: project.isUnderReview,
        },
      })
    }

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
        implementationChange,
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
    isUpcoming,
  }
}
