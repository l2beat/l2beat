import {
  type Layer2,
  type Layer3,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type ScalingProjectStack,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { type RosetteValue } from '~/components/rosette/types'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
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
      projectsChangeReport.getChanges(project.id),
      tvl.projects[project.id.toString()],
    ),
  )

  return groupByTabs(entries.sort(compareTvl))
}

export interface ScalingArchivedEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  purposes: ScalingProjectPurpose[]
  provider: ScalingProjectStack | undefined
  risks: RosetteValue[] | undefined
  totalTvl: number | undefined
  tvlOrder: number
}

function getScalingArchivedEntry(
  project: Layer2 | Layer3,
  changes: ProjectChanges,
  latestTvl: LatestTvl['projects'][string] | undefined,
): ScalingArchivedEntry {
  return {
    ...getCommonScalingEntry({ project, changes, syncStatus: undefined }),
    category: project.display.category,
    purposes: project.display.purposes,
    provider: project.display.provider,
    risks: project.type === 'layer2' ? getL2Risks(project.riskView) : undefined,
    totalTvl: latestTvl?.breakdown.total,
    tvlOrder: latestTvl?.breakdown.total ?? -1,
  }
}
