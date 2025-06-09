import type {
  Project,
  ProjectBridgeInfo,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { getTokensForProject } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { isTvsChartDataEmpty } from '~/server/features/utils/isChartDataEmpty'
import type { ExpressHelpers } from '~/trpc/server'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getDiagramParams } from '~/utils/project/getDiagramParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getBridgesRiskSummarySection } from '~/utils/project/risk-summary/getBridgesRiskSummary'
import { getBridgeOtherConsiderationsSection } from '~/utils/project/technology/getOtherConsiderationsSection'
import { getBridgeTechnologySection } from '~/utils/project/technology/getTechnologySection'
import type { UnderReviewStatus } from '~/utils/project/underReview'
import { getUnderReviewStatus } from '~/utils/project/underReview'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import { get7dTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import { getAssociatedTokenWarning } from '../../scaling/tvs/utils/getAssociatedTokenWarning'
import { getProjectIcon } from '../../utils/getProjectIcon'

export interface BridgesProjectEntry {
  name: string
  slug: string
  icon: string
  archivedAt: UnixTime | undefined
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
    validatedBy: TableReadyValue | undefined
  }
  sections: ProjectDetailsSection[]
  discoUiHref: string
}

export async function getBridgesProjectEntry(
  helpers: ExpressHelpers,
  project: Project<
    | 'statuses'
    | 'tvsInfo'
    | 'bridgeInfo'
    | 'bridgeRisks'
    | 'bridgeTechnology'
    | 'display',
    // optional
    | 'tvsConfig'
    | 'chainConfig'
    | 'archivedAt'
    | 'isUpcoming'
    | 'milestones'
    | 'contracts'
    | 'permissions'
  >,
): Promise<BridgesProjectEntry> {
  const [projectsChangeReport, tvsStats, tvsChartData, tokens, contractUtils] =
    await Promise.all([
      getProjectsChangeReport(),
      get7dTvsBreakdown({ type: 'projects', projectIds: [project.id] }),
      helpers.tvs.chart.fetch({
        range: '1y',
        filter: { type: 'projects', projectIds: [project.id] },
        excludeAssociatedTokens: false,
        previewRecategorisation: false,
      }),
      getTokensForProject(project),
      getContractUtils(),
    ])

  const tvsProjectStats = tvsStats.projects[project.id]

  const changes = projectsChangeReport.getChanges(project.id)

  const common: Omit<BridgesProjectEntry, 'sections'> = {
    name: project.name,
    slug: project.slug,
    icon: getProjectIcon(project.slug),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses.reviewStatus,
      ...changes,
    }),
    archivedAt: project.archivedAt,
    isUpcoming: !!project.isUpcoming,
    header: {
      description: project.display.description,
      warning: project.statuses.yellowWarning,
      links: getProjectLinks(project.display.links),
      tvs: tvsProjectStats
        ? {
            tokenBreakdown: {
              ...tvsProjectStats.breakdown,
              associated: tvsProjectStats.associated.total,
              warnings: compact([
                tvsProjectStats.breakdown.total > 0 &&
                  getAssociatedTokenWarning({
                    associatedRatio:
                      tvsProjectStats.associated.total /
                      tvsProjectStats.breakdown.total,
                    name: project.name,
                    associatedTokens: project.tvsInfo.associatedTokens,
                  }),
              ]),
              associatedTokens: project.tvsInfo.associatedTokens,
            },
            tvsBreakdown: {
              ...tvsProjectStats.breakdown,
              totalChange: tvsProjectStats.change.total,
            },
          }
        : undefined,
      destination: getDestination(project.bridgeInfo.destination),
      category: project.bridgeInfo.category,
      validatedBy: project.bridgeRisks.validatedBy,
    },
    discoUiHref: `https://disco.l2beat.com/ui/p/${project.id}`,
  }

  const sections: ProjectDetailsSection[] = []

  if (!project.isUpcoming && !isTvsChartDataEmpty(tvsChartData)) {
    sections.push({
      type: 'TvsSection',
      props: {
        id: 'tvs',
        title: 'Value Secured',
        projectId: project.id,
        tokens: tokens,
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
        isUnderReview: !!project.statuses.reviewStatus,
      },
    })
  }

  const technologySection = getBridgeTechnologySection(project)
  if (technologySection) {
    sections.push({
      type: 'TechnologyChoicesSection',
      props: {
        ...technologySection,
        id: 'technology',
        title: 'Technology',
      },
    })
  }

  const otherConsiderationsSection =
    getBridgeOtherConsiderationsSection(project)
  if (otherConsiderationsSection) {
    sections.push({
      type: 'TechnologyChoicesSection',
      props: {
        id: 'other-considerations',
        title: 'Other considerations',
        ...otherConsiderationsSection,
      },
    })
  }

  if (project.bridgeTechnology.upgradesAndGovernance) {
    sections.push({
      type: 'MarkdownSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        content: project.bridgeTechnology.upgradesAndGovernance,
        diagram: getDiagramParams(
          'upgrades-and-governance',
          project.bridgeTechnology.upgradesAndGovernanceImage ?? project.slug,
        ),
        mdClassName: 'text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
        isUnderReview: !!project.statuses.reviewStatus,
      },
    })
  }

  const permissionsSection = getPermissionsSection(
    {
      id: project.id,
      isUnderReview: !!project.statuses.reviewStatus,
      permissions: project.permissions,
    },
    contractUtils,
    projectsChangeReport,
  )
  if (permissionsSection) {
    sections.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'permissions',
        title: 'Permissions',
        discoUiHref: common.discoUiHref,
      },
    })
  }

  const contractsSection = getContractsSection(
    {
      id: project.id,
      slug: project.slug,
      isVerified: !project.statuses.isUnverified,
      isUnderReview: !!project.statuses.reviewStatus,
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
        discoUiHref: common.discoUiHref,
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
