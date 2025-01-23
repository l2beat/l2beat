import type { Layer2 } from '@l2beat/config'
import type { ContractsVerificationStatuses } from '@l2beat/shared-pure'
import { getPermissionedEntities } from '~/app/(top-nav)/data-availability/projects/[layer]/_utils/get-permissioned-entities'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import {
  isActivityChartDataEmpty,
  isTvlChartDataEmpty,
} from '~/server/features/utils/is-chart-data-empty'
import { api } from '~/trpc/server'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { getScalingRiskSummarySection } from '~/utils/project/risk-summary/get-scaling-risk-summary'
import { getDataAvailabilitySection } from '~/utils/project/technology/get-data-availability-section'
import { getOperatorSection } from '~/utils/project/technology/get-operator-section'
import { getOtherConsiderationsSection } from '~/utils/project/technology/get-other-considerations-section'
import { getScalingTechnologySection } from '~/utils/project/technology/get-technology-section'
import { getWithdrawalsSection } from '~/utils/project/technology/get-withdrawals-section'
import { getTokensForProject } from '../../tvl/tokens/get-tokens-for-project'
import type { DaSolution } from '../get-scaling-project-da-solution'

interface Params {
  project: Layer2
  isVerified: boolean
  contractsVerificationStatuses: ContractsVerificationStatuses
  projectsChangeReport: ProjectsChangeReport
  rosetteValues: RosetteValue[]
  daSolution?: DaSolution
}

export async function getL2ProjectDetails({
  project,
  isVerified,
  contractsVerificationStatuses,
  projectsChangeReport,
  rosetteValues,
  daSolution,
}: Params) {
  const permissionsSection = project.permissions
    ? getPermissionsSection(
        {
          id: project.id,
          type: project.type,
          isUnderReview: !!project.isUnderReview,
          permissions: project.permissions,
          nativePermissions: project.nativePermissions,
          daSolution,
        },
        contractsVerificationStatuses,
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
      architectureImage: project.display.architectureImage,
    },
    contractsVerificationStatuses,
    projectsChangeReport,
  )

  const riskSummary = getScalingRiskSummarySection(project, isVerified)
  const technologySection = getScalingTechnologySection(project)
  const operatorSection = getOperatorSection(project)
  const withdrawalsSection = getWithdrawalsSection(project)
  const otherConsiderationsSection = getOtherConsiderationsSection(project)
  const dataAvailabilitySection = getDataAvailabilitySection(project)

  await Promise.all([
    api.tvl.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens: false,
    }),
    api.activity.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
    }),
    api.costs.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
    }),
  ])
  const [tvlChartData, activityChartData, costsChartData, tokens] =
    await Promise.all([
      api.tvl.chart({
        range: '1y',
        filter: { type: 'projects', projectIds: [project.id] },
        excludeAssociatedTokens: false,
      }),
      api.activity.chart({
        range: '1y',
        filter: { type: 'projects', projectIds: [project.id] },
      }),
      api.costs.chart({
        range: '1y',
        filter: { type: 'projects', projectIds: [project.id] },
      }),
      getTokensForProject(project),
    ])

  const sortedMilestones =
    project.milestones?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ) ?? []

  const items: ProjectDetailsSection[] = []

  if (!project.isUpcoming && !isTvlChartDataEmpty(tvlChartData)) {
    items.push({
      type: 'ChartSection',
      props: {
        id: 'tvl',
        stacked: true,
        title: 'Value Secured',
        projectId: project.id,
        milestones: sortedMilestones,
        tokens,
      },
    })
  }

  if (!isActivityChartDataEmpty(activityChartData)) {
    items.push({
      type: 'ChartSection',
      props: {
        id: 'activity',
        title: 'Activity',
        projectId: project.id,
        milestones: sortedMilestones,
        category: project.display.category,
        projectName: project.display.name,
      },
    })
  }

  if (!project.isUpcoming && costsChartData.length > 0) {
    items.push({
      type: 'ChartSection',
      props: {
        id: 'onchain-costs',
        title: 'Onchain costs',
        projectId: project.id,
        milestones: sortedMilestones,
        projectName: project.display.name,
      },
    })
  }

  if (
    !project.isUpcoming &&
    project.milestones &&
    project.milestones.length > 0
  ) {
    items.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
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

  if (dataAvailabilitySection) {
    items.push({
      type: 'Group',
      props: {
        id: 'da-layer',
        title: 'Data availability',
        items: dataAvailabilitySection,
        description: project.dataAvailabilitySolution?.display?.description,
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
        diagram: getDiagramParams(
          'state-validation',
          project.display.stateValidationImage ?? project.display.slug,
        ),
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
          slug:
            project.display.upgradesAndGovernanceImage ?? project.display.slug,
        },
        mdClassName: 'text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
        isUnderReview: project.isUnderReview,
        includeChildrenIfUnderReview: true,
      },
    })
  }

  if (permissionsSection) {
    const permissionedEntities = project.dataAvailabilitySolution
      ? getPermissionedEntities(project.dataAvailabilitySolution.bridge)
      : undefined

    items.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'permissions',
        title: 'Permissions',
        permissionedEntities,
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

  if (project.knowledgeNuggets && project.knowledgeNuggets.length > 0) {
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
