import { type Layer2 } from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { isEmpty } from 'lodash'
import { type ProjectDetailsSection } from '~/app/_components/projects/sections/types'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { api } from '~/trpc/server'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { getScalingRiskSummarySection } from '~/utils/project/risk-summary/get-scaling-risk-summary'
import { getOperatorSection } from '~/utils/project/technology/get-operator-section'
import { getOtherConsiderationsSection } from '~/utils/project/technology/get-other-considerations-section'
import { getScalingTechnologySection } from '~/utils/project/technology/get-technology-section'
import { getWithdrawalsSection } from '~/utils/project/technology/get-withdrawals-section'

interface Params {
  project: Layer2
  isVerified: boolean
  contractsVerificationStatuses: ContractsVerificationStatuses
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  implementationChangeReport: ImplementationChangeReportApiResponse
  rosetteValues: RosetteValue[]
}

export async function getL2ProjectDetails({
  project,
  isVerified,
  contractsVerificationStatuses,
  manuallyVerifiedContracts,
  implementationChangeReport,
  rosetteValues,
}: Params) {
  const permissionsSection = project.permissions
    ? getPermissionsSection(
        {
          id: project.id,
          type: project.type,
          isUnderReview: !!project.isUnderReview,
          permissions: project.permissions,
          nativePermissions: project.nativePermissions,
        },
        contractsVerificationStatuses,
        manuallyVerifiedContracts,
      )
    : undefined

  const contractsSection = getContractsSection(
    {
      id: project.id,
      type: project.type,
      isVerified,
      slug: project.display.slug,
      contracts: project.contracts,
      isUnderReview: project.isUnderReview,
      escrows: project.config.escrows,
    },
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
  )

  const riskSummary = getScalingRiskSummarySection(project, isVerified)
  const technologySection = getScalingTechnologySection(project)
  const operatorSection = getOperatorSection(project)
  const withdrawalsSection = getWithdrawalsSection(project)
  const otherConsiderationsSection = getOtherConsiderationsSection(project)
  // Do I need to prefetch this?
  await api.scaling.costs.chart.prefetch({
    range: '1d',
    filter: { type: 'projects', projectIds: [project.id] },
  })
  const costsChartData = await api.scaling.costs.chart({
    range: '1d',
    filter: { type: 'projects', projectIds: [project.id] },
  })
  const items: ProjectDetailsSection[] = []

  if (!isEmpty(costsChartData.data)) {
    items.push({
      type: 'ChartSection',
      props: {
        id: 'onchain-costs',
        title: 'Onchain costs',
        projectId: project.id,
        milestones:
          project.milestones?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ) ?? [],
      },
    })
  }

  if (
    !project.isUpcoming &&
    project.milestones &&
    !isEmpty(project.milestones)
  ) {
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

  if (riskSummary.riskGroups.length > 0) {
    items.push({
      type: 'RiskSummarySection',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        ...riskSummary,
      },
    })
  }

  if (project.isUpcoming) {
    items.push({
      type: 'UpcomingDisclaimer',
      excludeFromNavigation: true,
    })
    return items
  }

  items.push({
    type: 'RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      rosetteType: 'pizza',
      rosetteValues,
      warning: project.display.warning,
      redWarning: project.display.redWarning,
      isVerified,
      isUnderReview: project.isUnderReview,
    },
  })

  if (project.stage.stage !== 'NotApplicable') {
    items.push({
      type: 'StageSection',
      props: {
        id: 'stage',
        title: 'Rollup stage',
        stageConfig: project.stage,
        name: project.display.name,
        icon: `/icons/${project.display.slug}.png`,
        type: project.display.category,
        isUnderReview: project.isUnderReview,
      },
    })
  }

  if (technologySection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'technology',
        title: 'Technology',
        ...technologySection,
      },
    })
  }

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
        stateValidation: project.stateValidation,
        diagram: getDiagramParams('state-validation', project.display.slug),
        isUnderReview: project.isUnderReview,
      },
    })
  }

  if (operatorSection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'operator',
        title: 'Operator',
        ...operatorSection,
      },
    })
  }

  if (withdrawalsSection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'withdrawals',
        title: 'Withdrawals',
        ...withdrawalsSection,
      },
    })
  }

  if (otherConsiderationsSection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'other-considerations',
        title: 'Other considerations',
        ...otherConsiderationsSection,
      },
    })
  }
  if (project.upgradesAndGovernance) {
    items.push({
      type: 'MarkdownSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        content: project.upgradesAndGovernance,
        diagram: {
          type: 'upgrades-and-governance',
          slug: project.display.slug,
        },
        isUnderReview: project.isUnderReview,
        includeChildrenIfUnderReview: true,
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

  if (contractsSection) {
    items.push({
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'contracts',
        title: 'Smart contracts',
      },
    })
  }

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

  return items
}
