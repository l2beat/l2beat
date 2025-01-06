import { type Bridge } from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { type ProjectDetailsSection } from '~/components/projects/sections/types'
import { type ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import { getTokensForProject } from '~/server/features/scaling/tvl/tokens/get-tokens-for-project'
import { isTvlChartDataEmpty } from '~/server/features/utils/is-chart-data-empty'
import { api } from '~/trpc/server'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getBridgesRiskSummarySection } from '~/utils/project/risk-summary/get-bridges-risk-summary'
import { getBridgeTechnologySection } from '~/utils/project/technology/get-technology-section'

export async function getBridgeProjectDetails(
  bridge: Bridge,
  isVerified: boolean,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  projectsChangeReport: ProjectsChangeReport,
) {
  const permissionsSection = bridge.permissions
    ? getPermissionsSection(
        {
          id: bridge.id,
          type: bridge.type,
          isUnderReview: !!bridge.isUnderReview,
          permissions: bridge.permissions,
          nativePermissions: bridge.nativePermissions,
        },
        contractsVerificationStatuses,
        manuallyVerifiedContracts,
      )
    : undefined
  const contractsSection = bridge.contracts
    ? getContractsSection(
        {
          id: bridge.id,
          type: bridge.type,
          isVerified,
          slug: bridge.display.slug,
          contracts: bridge.contracts,
          isUnderReview: bridge.isUnderReview,
          escrows: bridge.config.escrows,
        },
        contractsVerificationStatuses,
        manuallyVerifiedContracts,
        projectsChangeReport,
      )
    : undefined
  const riskSummary = getBridgesRiskSummarySection(bridge, isVerified)
  const technologySection = getBridgeTechnologySection(bridge)

  await api.tvl.chart.prefetch({
    range: '7d',
    filter: { type: 'projects', projectIds: [bridge.id] },
    excludeAssociatedTokens: false,
  })
  const [tvlChartData, tokens] = await Promise.all([
    api.tvl.chart({
      range: '7d',
      filter: { type: 'projects', projectIds: [bridge.id] },
      excludeAssociatedTokens: false,
    }),
    getTokensForProject(bridge),
  ])

  const items: ProjectDetailsSection[] = []

  if (!bridge.isUpcoming && !isTvlChartDataEmpty(tvlChartData)) {
    items.push({
      type: 'ChartSection',
      props: {
        id: 'tvl',
        title: 'Value Locked',
        projectId: bridge.id,
        tokens: tokens,
        isBridge: true,
        milestones: [],
      },
    })
  }

  if (bridge.milestones && bridge.milestones.length > 0) {
    items.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        milestones: bridge.milestones,
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
      },
    })
  }

  if (bridge.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: bridge.display.description,
        detailedDescription: bridge.display.detailedDescription,
      },
    })
  }

  if (riskSummary.riskGroups.length > 0) {
    items.push({
      type: 'RiskSummarySection',
      props: {
        id: 'risk-analysis',
        title: 'Risk summary',
        ...riskSummary,
      },
    })
  }

  if (technologySection) {
    items.push({
      type: 'TechnologySection',
      props: {
        ...technologySection,
        id: 'technology',
        title: 'Technology',
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

  if (contractsSection)
    items.push({
      type: 'ContractsSection',
      props: {
        id: 'contracts',
        title: 'Smart contracts',
        ...contractsSection,
      },
    })

  if (bridge.knowledgeNuggets && bridge.knowledgeNuggets.length > 0) {
    items.push({
      type: 'KnowledgeNuggetsSection',
      props: {
        knowledgeNuggets: bridge.knowledgeNuggets,
        id: 'knowledge-nuggets',
        title: 'Knowledge Nuggets',
      },
    })
  }

  return items
}
