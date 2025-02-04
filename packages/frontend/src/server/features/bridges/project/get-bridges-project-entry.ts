import type { Bridge, TableReadyValue } from '@l2beat/config'
import { isVerified } from '@l2beat/config'
import compact from 'lodash/compact'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getTvsProjectStats } from '../../scaling/tvs/get-tvs-project-stats'
import { getAssociatedTokenWarning } from '../../scaling/tvs/utils/get-associated-token-warning'
import { getBridgeProjectDetails } from './utils/get-bridge-project-details'

export type BridgesProjectEntry = Awaited<
  ReturnType<typeof getBridgesProjectEntry>
>

export async function getBridgesProjectEntry(project: Bridge) {
  const [projectsChangeReport, header] = await Promise.all([
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
      projectsChangeReport,
    ),
  }
}

async function getHeader(project: Bridge) {
  const tvsProjectStats = await getTvsProjectStats(project)

  const associatedTokens = project.config.associatedTokens ?? []

  return {
    description: project.display.description,
    warning: project.display.warning,
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
                  name: project.display.name,
                  associatedTokens,
                }),
            ]),
            associatedTokens,
          },
          tvsBreakdown: tvsProjectStats.tvsBreakdown,
        }
      : undefined,
    destination: getDestination(project.technology.destination),
    category: project.display.category,
    validatedBy: project.riskView?.validatedBy,
  }
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
