import { type Bridge, bridges } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
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
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]

      return getBridgesRiskEntry(project, projectsChangeReport, isVerified)
    })
    .filter(notUndefined)

  return orderByTvl(entries, tvl)
}

function getBridgesRiskEntry(
  project: Bridge,
  projectsChangeReport: ProjectsChangeReport,
  isVerified: boolean,
) {
  const hasImplementationChanged =
    projectsChangeReport.hasImplementationChangedOnChain(
      project.id.toString(),
      'ethereum',
    )
  const hasHighSeverityFieldChanged =
    projectsChangeReport.hasHighSeverityFieldChanged(project.id.toString())

  return {
    id: project.id,
    href: `/bridges/projects/${project.display.slug}`,
    type: project.type,
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    warning: project.display.warning,
    isArchived: project.isArchived,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: isAnySectionUnderReview(project),
      hasImplementationChanged,
      hasHighSeverityFieldChanged,
    }),
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
