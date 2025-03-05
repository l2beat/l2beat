import type {
  Project,
  ProjectBridgeInfo,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import { bridges, isVerified } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { getTokensForProject } from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import { isTvsChartDataEmpty } from '~/server/features/utils/is-chart-data-empty'
import { api } from '~/trpc/server'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getBridgesRiskSummarySection } from '~/utils/project/risk-summary/get-bridges-risk-summary'
import { getBridgeTechnologySection } from '~/utils/project/technology/get-technology-section'
import {
  UnderReviewStatus,
  getUnderReviewStatus,
} from '~/utils/project/under-review'
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
  project: Project<'tvlConfig' | 'bridgeInfo' | 'display', 'chainConfig'>,
): Promise<BridgesProjectEntry> {
  /** @deprecated */
  const legacy = bridges.find((x) => x.id === project.id)
  assert(legacy)
  const [projectsChangeReport, tvsProjectStats] = await Promise.all([
    getProjectsChangeReport(),
    getTvsProjectStats(project),
  ])

  const isProjectVerified = isVerified(legacy)
  const changes = projectsChangeReport.getChanges(project.id)
  const associatedTokens = legacy.config.associatedTokens ?? []

  const common: Omit<BridgesProjectEntry, 'sections'> = {
    name: project.name,
    slug: project.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!legacy.isUnderReview,
      ...changes,
    }),
    isArchived: !!legacy.isArchived,
    isUpcoming: !!legacy.isUpcoming,
    header: {
      description: project.display.description,
      warning: legacy.display.warning,
      links: getProjectLinks(legacy.display.links),
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
                    associatedTokens,
                  }),
              ]),
              associatedTokens,
            },
            tvsBreakdown: tvsProjectStats.tvsBreakdown,
          }
        : undefined,
      destination: getDestination(legacy.technology.destination),
      category: project.bridgeInfo.category,
      validatedBy: legacy.riskView?.validatedBy,
    },
  }

  await api.tvs.chart.prefetch({
    range: '1y',
    filter: { type: 'projects', projectIds: [legacy.id] },
    excludeAssociatedTokens: false,
  })
  const [tvsChartData, tokens] = await Promise.all([
    api.tvs.chart({
      range: '1y',
      filter: { type: 'projects', projectIds: [legacy.id] },
      excludeAssociatedTokens: false,
    }),
    getTokensForProject(legacy.id),
  ])

  const sections: ProjectDetailsSection[] = []

  if (!legacy.isUpcoming && !isTvsChartDataEmpty(tvsChartData)) {
    sections.push({
      type: 'ChartSection',
      props: {
        id: 'tvs',
        title: 'Value Secured',
        projectId: legacy.id,
        tokens: tokens,
        isBridge: true,
        milestones: legacy.milestones ?? [],
      },
    })
  }

  if (legacy.milestones && legacy.milestones.length > 0) {
    const sortedMilestones = legacy.milestones.sort(
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

  if (legacy.display.detailedDescription) {
    sections.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: legacy.display.description,
        detailedDescription: legacy.display.detailedDescription,
      },
    })
  }

  const riskSummary = getBridgesRiskSummarySection(legacy, isProjectVerified)
  if (riskSummary.riskGroups.length > 0) {
    sections.push({
      type: 'RiskSummarySection',
      props: {
        id: 'risk-analysis',
        title: 'Risk summary',
        ...riskSummary,
        isUnderReview: legacy.isUnderReview,
      },
    })
  }

  const technologySection = getBridgeTechnologySection(legacy)
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

  const permissionsSection = getPermissionsSection({
    type: 'bridge',
    id: legacy.id,
    isUnderReview: !!legacy.isUnderReview,
    permissions: legacy.permissions,
  })
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
      id: legacy.id,
      isVerified: isProjectVerified,
      slug: legacy.display.slug,
      contracts: legacy.contracts,
      isUnderReview: legacy.isUnderReview,
      escrows: legacy.config.escrows,
      hostChainName: 'Ethereum',
    },
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
