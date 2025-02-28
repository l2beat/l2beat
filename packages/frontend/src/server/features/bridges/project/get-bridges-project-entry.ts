import type { Project, TableReadyValue } from '@l2beat/config'
import { bridges, isVerified } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
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

export async function getBridgesProjectEntry(
  project: Project<'tvlConfig' | 'bridgeInfo' | 'display', 'chainConfig'>,
) {
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

  return {
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
    projectDetails: await getBridgeProjectDetails(
      legacy,
      isProjectVerified,
      projectsChangeReport,
    ),
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
