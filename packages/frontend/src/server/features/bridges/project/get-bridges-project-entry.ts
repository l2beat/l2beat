import {
  type Bridge,
  type ScalingProjectRiskViewEntry,
  getContractsVerificationStatuses,
  isVerified,
} from '@l2beat/config'
import compact from 'lodash/compact'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getTvlProjectStats } from '../../scaling/tvl/get-tvl-project-stats'
import { getAssociatedTokenWarning } from '../../scaling/tvl/utils/get-associated-token-warning'
import { getBridgeProjectDetails } from './utils/get-bridge-project-details'

export type BridgesProjectEntry = Awaited<
  ReturnType<typeof getBridgesProjectEntry>
>

export async function getBridgesProjectEntry(project: Bridge) {
  const [contractsVerificationStatuses, projectsChangeReport, header] =
    await Promise.all([
      getContractsVerificationStatuses(project),
      getProjectsChangeReport(),
      getHeader(project),
    ])

  const isProjectVerified = isVerified(project)
  const changes = projectsChangeReport.getChanges(project.id)

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.isUnderReview,
      ...changes,
    }),
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    header,
    projectDetails: await getBridgeProjectDetails(
      project,
      isProjectVerified,
      contractsVerificationStatuses,
      projectsChangeReport,
    ),
  }
}

async function getHeader(project: Bridge) {
  const tvlProjectStats = await getTvlProjectStats(project)

  const associatedTokens = project.config.associatedTokens ?? []

  return {
    description: project.display.description,
    warning: project.display.warning,
    links: getProjectLinks(project.display.links),
    tvl: tvlProjectStats
      ? {
          tokenBreakdown: {
            ...tvlProjectStats.tokenBreakdown,
            warnings: compact([
              tvlProjectStats.tokenBreakdown.total > 0 &&
                getAssociatedTokenWarning({
                  associatedRatio:
                    tvlProjectStats.tokenBreakdown.associated /
                    tvlProjectStats.tokenBreakdown.total,
                  name: project.display.name,
                  associatedTokens,
                }),
            ]),
            associatedTokens,
          },
          tvlBreakdown: tvlProjectStats.tvlBreakdown,
        }
      : undefined,
    destination: getDestination(project.technology.destination),
    category: project.display.category,
    validatedBy: project.riskView?.validatedBy,
  }
}

function getDestination(destinations: string[]): ScalingProjectRiskViewEntry {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  const firstItem = destinations[0]
  if (destinations.length === 1 && firstItem) {
    return { value: firstItem, description: '', sentiment: 'neutral' }
  }

  return {
    value: 'Various',
    description: destinations.join(',\n'),
    sentiment: 'neutral',
  }
}
