import { type Bridge, type Layer2, bridges } from '@l2beat/config'
import { type ProjectId, notUndefined } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getDestination } from './get-destination'
import { type BridgesRiskEntry } from './types'

export async function getBridgeRiskEntries(
  tvl: Record<ProjectId, number>,
): Promise<BridgesRiskEntry[]> {
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const implementationChangeReport = await getImplementationChangeReport()
  const included = bridges.filter((project) => !project.isUpcoming)
  const orderedByTvl = orderByTvl(included, tvl)

  return orderedByTvl
    .map((project) => {
      const hasImplementationChanged =
        !!implementationChangeReport.projects[project.id.toString()]
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]

      return getBridgesRiskEntry(project, hasImplementationChanged, isVerified)
    })
    .filter(notUndefined)
}

function getBridgesRiskEntry(
  project: Layer2 | Bridge,
  hasImplementationChanged: boolean,
  isVerified: boolean,
): BridgesRiskEntry {
  return {
    href: `/bridges/${project.display.slug}`,
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
