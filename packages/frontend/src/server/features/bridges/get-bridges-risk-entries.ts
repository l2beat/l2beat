import { type Bridge, bridges } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { getProjectsLatestTvlUsd } from '../scaling/tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../scaling/tvl/utils/order-by-tvl'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getDestination } from './get-destination'

export async function getBridgeRiskEntries() {
  const [tvl, projectsVerificationStatuses, projectsChangeReport] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getProjectsVerificationStatuses(),
      getProjectsChangeReport(),
    ])

  const included = bridges.filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )

  const entries = included
    .map((project) => {
      const hasImplementationChanged =
        projectsChangeReport.hasImplementationChangedOnChain(
          project.id.toString(),
          'ethereum',
        )

      const isVerified = !!projectsVerificationStatuses[project.id.toString()]

      return getBridgesRiskEntry(project, hasImplementationChanged, isVerified)
    })
    .filter(notUndefined)

  return orderByTvl(entries, tvl)
}

function getBridgesRiskEntry(
  project: Bridge,
  hasImplementationChanged: boolean,
  isVerified: boolean,
) {
  return {
    id: project.id,
    href: `/bridges/projects/${project.display.slug}`,
    type: project.type,
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    warning: project.display.warning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    hasImplementationChanged,
    isVerified,
    category: project.display.category,
    destination: getDestination(
      project.type === 'bridge'
        ? project.technology.destination
        : [project.display.name],
    ),
    ...project.riskView,
  }
}

export type BridgesRiskEntry = Awaited<
  ReturnType<typeof getBridgeRiskEntries>
>[number]
