import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { getProjectsVerificationStatuses } from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { compareTvl } from '../tvl/utils/compare-tvl'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../tvl/utils/get-7d-token-breakdown'

export async function getScalingArchivedEntries() {
  const [projectsChangeReport, tvl] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
  ])

  const projects = [...layer2s, ...layer3s].filter((p) => p.isArchived)

  const entries = projects.map((project) =>
    getScalingArchivedEntry(
      project,
      getProjectsVerificationStatuses(project),
      projectsChangeReport,
      tvl.projects[project.id.toString()],
    ),
  )

  return groupByTabs(entries.sort(compareTvl))
}

export type ScalingArchivedEntry = ReturnType<typeof getScalingArchivedEntry>

function getScalingArchivedEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
  latestTvl: LatestTvl['projects'][string] | undefined,
) {
  return {
    entryType: 'archived' as const,
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      syncStatus: undefined,
    }),
    category: project.display.category,
    purposes: project.display.purposes,
    provider: project.display.provider,
    risks: project.type === 'layer2' ? getL2Risks(project.riskView) : undefined,
    totalTvl: latestTvl?.breakdown.total,
    tvlOrder: latestTvl?.breakdown.total ?? 0,
  }
}
