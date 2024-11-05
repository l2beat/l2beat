import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../tvl/utils/get-7d-token-breakdown'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

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
      projectsChangeReport.hasImplementationChanged(project.id),
      tvl.projects[project.id.toString()],
    ),
  )

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
  )
  return orderByTvl(entries, remappedForOrdering)
}

export type ScalingArchivedEntry = ReturnType<typeof getScalingArchivedEntry>

export function getScalingArchivedEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  hasImplementationChanged: boolean,
  latestTvl: LatestTvl['projects'][string] | undefined,
) {
  return {
    entryType: 'archived' as const,
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged,
    }),
    risks: project.type === 'layer2' ? getL2Risks(project.riskView) : undefined,
    totalTvl: latestTvl?.breakdown.total,
  }
}
