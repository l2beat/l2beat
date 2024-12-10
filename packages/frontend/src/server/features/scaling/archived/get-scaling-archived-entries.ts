import {
  type Layer2,
  Layer2Provider,
  type Layer3,
  Layer3Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import {
  CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../tvl/utils/get-7d-token-breakdown'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { CommonProjectEntry } from '~/types/common-project-entry'
import { RosetteValue } from '~/components/rosette/types'

export async function getScalingArchivedEntries() {
  const [projectsChangeReport, projectsVerificationStatuses, tvl] =
    await Promise.all([
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
      get7dTokenBreakdown({ type: 'layer2' }),
    ])

  const projects = [...layer2s, ...layer3s].filter((p) => p.isArchived)

  const entries = projects.map((project) =>
    getScalingArchivedEntry(
      project,
      !!projectsVerificationStatuses[project.id.toString()],
      projectsChangeReport,
      tvl.projects[project.id.toString()],
    ),
  )

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
  )
  return groupByMainCategories(orderByTvl(entries, remappedForOrdering))
}

export interface ScalingArchivedEntry extends CommonScalingEntry {
  risks: RosetteValue[]
  category: ScalingProjectCategory
  provider: Layer2Provider | Layer3Provider | undefined
  purposes: ScalingProjectPurpose[]
  totalTvl: number
}

function getScalingArchivedEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
  latestTvl: LatestTvl['projects'][string] | undefined,
): ScalingArchivedEntry {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
    }),
    risks: getL2Risks(project.riskView),
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
    totalTvl: latestTvl?.breakdown.total ?? 0,
  }
}
