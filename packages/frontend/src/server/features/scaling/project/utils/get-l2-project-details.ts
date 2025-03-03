import type { Layer2, Project } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import {
  isActivityChartDataEmpty,
  isTvsChartDataEmpty,
} from '~/server/features/utils/is-chart-data-empty'
import { api } from '~/trpc/server'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getTrackedTransactions } from '~/utils/project/costs/get-tracked-transactions'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { getScalingRiskSummarySection } from '~/utils/project/risk-summary/get-scaling-risk-summary'
import { getDataAvailabilitySection } from '~/utils/project/technology/get-data-availability-section'
import { getOperatorSection } from '~/utils/project/technology/get-operator-section'
import { getOtherConsiderationsSection } from '~/utils/project/technology/get-other-considerations-section'
import { getSequencingSection } from '~/utils/project/technology/get-sequencing-section'
import { getScalingTechnologySection } from '~/utils/project/technology/get-technology-section'
import { getWithdrawalsSection } from '~/utils/project/technology/get-withdrawals-section'
import { getTokensForProject } from '../../tvs/tokens/get-tokens-for-project'
import type { DaSolution } from '../get-scaling-project-da-solution'

interface Params {
  legacy: Layer2
  project: Project<'statuses'>
  projectsChangeReport: ProjectsChangeReport
  rosetteValues: RosetteValue[]
  daSolution?: DaSolution
}

export async function getL2ProjectDetails({
  legacy,
  project,
  projectsChangeReport,
  rosetteValues,
  daSolution,
}: Params) {
  const permissionsSection = legacy.permissions
    ? getPermissionsSection({
        id: legacy.id,
        type: legacy.type,
        isUnderReview: !!legacy.isUnderReview,
        permissions: legacy.permissions,
        daSolution,
      })
    : undefined

  const contractsSection = getContractsSection(
    {
      id: legacy.id,
      type: legacy.type,
      isVerified: !project.statuses.isUnverified,
      slug: legacy.display.slug,
      contracts: legacy.contracts,
      isUnderReview: legacy.isUnderReview,
      escrows: legacy.config.escrows,
      architectureImage: legacy.display.architectureImage,
      daSolution,
    },
    projectsChangeReport,
  )

  const riskSummary = getScalingRiskSummarySection(
    legacy,
    !project.statuses.isUnverified,
  )
  const technologySection = await getScalingTechnologySection(legacy)
  const operatorSection = getOperatorSection(legacy)
  const withdrawalsSection = getWithdrawalsSection(legacy)
  const otherConsiderationsSection = getOtherConsiderationsSection(legacy)
  const dataAvailabilitySection = getDataAvailabilitySection(legacy)
  const sequencingSection = getSequencingSection(legacy)
  const trackedTransactions = getTrackedTransactions(legacy)

  await Promise.all([
    api.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [legacy.id] },
      excludeAssociatedTokens: false,
    }),
    api.activity.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [legacy.id] },
    }),
    api.costs.chartWithDataPosted.prefetch({
      range: '1y',
      projectId: legacy.id,
    }),
  ])
  const [tvsChartData, activityChartData, costsChartData, tokens] =
    await Promise.all([
      api.tvs.chart({
        range: '1y',
        filter: { type: 'projects', projectIds: [legacy.id] },
        excludeAssociatedTokens: false,
      }),
      api.activity.chart({
        range: '1y',
        filter: { type: 'projects', projectIds: [legacy.id] },
      }),
      api.costs.chartWithDataPosted({
        range: '1y',
        projectId: legacy.id,
      }),
      getTokensForProject(legacy),
    ])

  const sortedMilestones =
    legacy.milestones?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ) ?? []

  const items: ProjectDetailsSection[] = []

  if (!legacy.isUpcoming && !isTvsChartDataEmpty(tvsChartData)) {
    items.push({
      type: 'ChartSection',
      props: {
        id: 'tvs',
        stacked: true,
        title: 'Value Secured',
        projectId: legacy.id,
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
        projectId: legacy.id,
        milestones: sortedMilestones,
        category: legacy.display.category,
        projectName: legacy.display.name,
      },
    })
  }

  if (!legacy.isUpcoming && costsChartData.length > 0) {
    items.push({
      type: 'CostsSection',
      props: {
        id: 'onchain-costs',
        title: 'Onchain costs',
        projectId: legacy.id,
        milestones: sortedMilestones,
        trackedTransactions,
      },
    })
  }

  if (!legacy.isUpcoming && legacy.milestones && legacy.milestones.length > 0) {
    items.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
        milestones: sortedMilestones,
      },
    })
  }

  if (legacy.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: legacy.display.description,
        detailedDescription: legacy.display.detailedDescription,
      },
    })
  }

  if (riskSummary.riskGroups.length > 0) {
    items.push({
      type: 'RiskSummarySection',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        isUnderReview: legacy.isUnderReview,
        ...riskSummary,
      },
    })
  }

  if (legacy.isUpcoming) {
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
      warning: legacy.display.warning,
      redWarning: legacy.display.redWarning,
      isVerified: !project.statuses.isUnverified,
      isUnderReview: legacy.isUnderReview,
    },
  })

  if (legacy.stage.stage !== 'NotApplicable') {
    items.push({
      type: 'StageSection',
      props: {
        id: 'stage',
        title: 'Rollup stage',
        stageConfig: legacy.stage,
        name: legacy.display.name,
        icon: `/icons/${legacy.display.slug}.png`,
        type: legacy.display.category,
        isUnderReview: legacy.isUnderReview,
        isAppchain: legacy.capability === 'appchain',
        additionalConsiderations:
          legacy.stage.stage !== 'UnderReview'
            ? legacy.stage.additionalConsiderations
            : undefined,
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
        description: legacy.customDa?.description,
      },
    })
  }

  if (legacy.stateDerivation) {
    items.push({
      type: 'StateDerivationSection',
      props: {
        id: 'state-derivation',
        title: 'State derivation',
        isUnderReview:
          !!legacy.isUnderReview || !!legacy.stateDerivation.isUnderReview,
        ...legacy.stateDerivation,
      },
    })
  }

  if (legacy.stateValidation) {
    items.push({
      type: 'StateValidationSection',
      props: {
        id: 'state-validation',
        title: 'State validation',
        stateValidation: legacy.stateValidation,
        diagram: getDiagramParams(
          'state-validation',
          legacy.display.stateValidationImage ?? legacy.display.slug,
        ),
        isUnderReview:
          !!legacy.isUnderReview || !!legacy.stateValidation.isUnderReview,
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

  if (sequencingSection) {
    items.push({
      type: 'SequencingSection',
      props: {
        id: 'sequencing',
        title: 'Sequencing',
        ...sequencingSection,
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
  if (legacy.upgradesAndGovernance) {
    items.push({
      type: 'MarkdownSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        content: legacy.upgradesAndGovernance,
        diagram: {
          type: 'upgrades-and-governance',
          slug:
            legacy.display.upgradesAndGovernanceImage ?? legacy.display.slug,
        },
        mdClassName: 'text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
        isUnderReview: legacy.isUnderReview,
      },
    })
  }

  if (permissionsSection) {
    const permissionedEntities = legacy.customDa?.dac?.knownMembers

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

  return items
}
