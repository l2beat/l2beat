import type {
  Project,
  ProjectBridgeInfo,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import compact from 'lodash/compact'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { getTokensForProject } from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import { isTvsChartDataEmpty } from '~/server/features/utils/is-chart-data-empty'
import { api } from '~/trpc/server'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/get-contract-utils'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getBridgesRiskSummarySection } from '~/utils/project/risk-summary/get-bridges-risk-summary'
import { getBridgeTechnologySection } from '~/utils/project/technology/get-technology-section'
import type { UnderReviewStatus } from '~/utils/project/under-review'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getTvsProjectStats } from '../../scaling/tvs/get-tvs-project-stats'
import { getAssociatedTokenWarning } from '../../scaling/tvs/utils/get-associated-token-warning'

export interface BridgesProjectEntry {
  name: string
  slug: string
  isArchived: boolean
  isUpcoming: boolean
  underReviewStatus: UnderReviewStatus
  header: {
    description?: string
    warning?: string
    links: ProjectLink[]
    tvs?: {
      tvsBreakdown: {
        total: number
        native: number
        canonical: number
        external: number
        totalChange: number
      }
      tokenBreakdown: {
        total: number
        ether: number
        stablecoin: number
        associated: number
        warnings: WarningWithSentiment[]
        associatedTokens: string[]
      }
    }
    destination: TableReadyValue
    category: ProjectBridgeInfo['category']
    validatedBy: TableReadyValue
  }
  sections: ProjectDetailsSection[]
}

export async function getBridgesProjectEntry(
  project: Project<
    | 'statuses'
    | 'tvlInfo'
    | 'tvlConfig'
    | 'bridgeInfo'
    | 'bridgeRisks'
    | 'bridgeTechnology'
    | 'display',
    // optional
    | 'chainConfig'
    | 'isArchived'
    | 'isUpcoming'
    | 'milestones'
    | 'contracts'
    | 'permissions'
  >,
): Promise<BridgesProjectEntry> {
  const [projectsChangeReport, tvsProjectStats] = await Promise.all([
    getProjectsChangeReport(),
    getTvsProjectStats(project),
  ])

  const changes = projectsChangeReport.getChanges(project.id)

  const common: Omit<BridgesProjectEntry, 'sections'> = {
    name: project.name,
    slug: project.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: project.statuses.isUnderReview,
      ...changes,
    }),
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    header: {
      description: project.display.description,
      warning: project.statuses.yellowWarning,
      links: getProjectLinks(project.display.links),
      tvs: tvsProjectStats
        ? {
            tokenBreakdown: {
              ...tvsProjectStats.tokenBreakdown,
              warnings: compact([
                tvsProjectStats.tokenBreakdown.total > 0 &&
                  getAssociatedTokenWarning({
                    associatedRatio:
                      tvsProjectStats.tokenBreakdown.associated /
                      tvsProjectStats.tokenBreakdown.total,
                    name: project.name,
                    associatedTokens: project.tvlInfo.associatedTokens,
                  }),
              ]),
              associatedTokens: project.tvlInfo.associatedTokens,
            },
            tvsBreakdown: tvsProjectStats.tvsBreakdown,
          }
        : undefined,
      destination: getDestination(project.bridgeInfo.destination),
      category: project.bridgeInfo.category,
      validatedBy: project.bridgeRisks.validatedBy,
    },
  }

  await api.tvs.chart.prefetch({
    range: '1y',
    filter: { type: 'projects', projectIds: [project.id] },
    excludeAssociatedTokens: false,
  })
  const [tvsChartData, tokens] = await Promise.all([
    api.tvs.chart({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens: false,
    }),
    getTokensForProject(project.id),
  ])

  const sections: ProjectDetailsSection[] = []

  if (!project.isUpcoming && !isTvsChartDataEmpty(tvsChartData)) {
    sections.push({
      type: 'ChartSection',
      props: {
        id: 'tvs',
        title: 'Value Secured',
        projectId: project.id,
        tokens: tokens,
        isBridge: true,
        milestones: project.milestones ?? [],
      },
    })
  }

  if (project.milestones && project.milestones.length > 0) {
    const sortedMilestones = project.milestones.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    sections.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        milestones: sortedMilestones,
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
      },
    })
  }

  if (project.bridgeTechnology.detailedDescription) {
    sections.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: project.display.description,
        detailedDescription: project.bridgeTechnology.detailedDescription,
      },
    })
  }

  const riskSummary = getBridgesRiskSummarySection(
    project,
    !project.statuses.isUnverified,
  )
  if (riskSummary.riskGroups.length > 0) {
    sections.push({
      type: 'RiskSummarySection',
      props: {
        id: 'risk-analysis',
        title: 'Risk summary',
        ...riskSummary,
        isUnderReview: project.statuses.isUnderReview,
      },
    })
  }

  const technologySection = getBridgeTechnologySection(project)
  if (technologySection) {
    sections.push({
      type: 'TechnologySection',
      props: {
        ...technologySection,
        id: 'technology',
        title: 'Technology',
      },
    })
  }

  const contractUtils = await getContractUtils()

  const permissionsSection = getPermissionsSection(
    {
      type: 'bridge',
      id: project.id,
      isUnderReview: project.statuses.isUnderReview,
      permissions: project.permissions,
    },
    contractUtils,
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

  const contractsSection = getContractsSection(
    {
      type: 'bridge',
      id: project.id,
      slug: project.slug,
      isVerified: !project.statuses.isUnverified,
      isUnderReview: project.statuses.isUnderReview,
      contracts: project.contracts,
    },
    contractUtils,
    projectsChangeReport,
  )
  if (contractsSection)
    sections.push({
      type: 'ContractsSection',
      props: {
        id: 'contracts',
        title: 'Smart contracts',
        ...contractsSection,
      },
    })

  return { ...common, sections }
}

function getDestination(destinations: string[]): TableReadyValue {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  const firstItem = destinations[0]
  if (destinations.length === 1 && firstItem) {
    return { value: firstItem }
  }
  return { value: 'Various', description: destinations.join(',\n') }
}
