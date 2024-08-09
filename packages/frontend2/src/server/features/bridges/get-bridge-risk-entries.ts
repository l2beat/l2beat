import { type Bridge, type Layer2, bridges } from '@l2beat/config'
import {
  type ProjectId,
  type ProjectsVerificationStatuses,
  notUndefined,
} from '@l2beat/shared-pure'
import { type ImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getDestination } from './get-destination'
import { type BridgesRiskEntry } from './types'

export async function getBridgeRiskEntries(
  tvl: Record<ProjectId, number>,
  implementationChangeReport: ImplementationChangeReport,
  projectsVerificationStatuses: ProjectsVerificationStatuses,
): Promise<BridgesRiskEntry[]> {
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
