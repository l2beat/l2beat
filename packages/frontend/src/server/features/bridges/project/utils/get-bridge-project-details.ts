import type { Bridge } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import { getTokensForProject } from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import { isTvsChartDataEmpty } from '~/server/features/utils/is-chart-data-empty'
import { api } from '~/trpc/server'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getBridgesRiskSummarySection } from '~/utils/project/risk-summary/get-bridges-risk-summary'
import { getBridgeTechnologySection } from '~/utils/project/technology/get-technology-section'

export async function getBridgeProjectDetails(
  bridge: Bridge,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
) {
  const permissionsSection = bridge.permissions
    ? getPermissionsSection({
        type: 'bridge',
        id: bridge.id,
        isUnderReview: !!bridge.isUnderReview,
        permissions: bridge.permissions,
      })
    : undefined
  const contractsSection = bridge.contracts
    ? getContractsSection(
        {
          type: 'bridge',
          id: bridge.id,
          isVerified,
          slug: bridge.display.slug,
          contracts: bridge.contracts,
          isUnderReview: bridge.isUnderReview,
          escrows: bridge.config.escrows,
        },
        projectsChangeReport,
      )
    : undefined
  const riskSummary = getBridgesRiskSummarySection(bridge, isVerified)
  const technologySection = getBridgeTechnologySection(bridge)

  await api.tvs.chart.prefetch({
    range: '1y',
    filter: { type: 'projects', projectIds: [bridge.id] },
    excludeAssociatedTokens: false,
  })
  const [tvsChartData, tokens] = await Promise.all([
    api.tvs.chart({
      range: '1y',
      filter: { type: 'projects', projectIds: [bridge.id] },
      excludeAssociatedTokens: false,
    }),
    getTokensForProject(bridge),
  ])

  const items: ProjectDetailsSection[] = []

  if (!bridge.isUpcoming && !isTvsChartDataEmpty(tvsChartData)) {
    items.push({
      type: 'ChartSection',
      props: {
        id: 'tvs',
        title: 'Value Secured',
        projectId: bridge.id,
        tokens: tokens,
        isBridge: true,
        milestones: bridge.milestones ?? [],
      },
    })
  }

  if (bridge.milestones && bridge.milestones.length > 0) {
    const sortedMilestones = bridge.milestones.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    items.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        milestones: sortedMilestones,
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
        isUnderReview: bridge.isUnderReview,
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
