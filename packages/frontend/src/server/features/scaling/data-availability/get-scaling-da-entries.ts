import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingDaEntries() {
  const activeProjects = [...layer2s, ...layer3s].filter(
    (p) => !p.isUpcoming && !(p.type === 'layer2' && p.isArchived),
  )
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  const entries = activeProjects
    .map((project) =>
      getScalingDataAvailabilityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl[project.id],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

function getScalingDataAvailabilityEntry(
  project: Layer2 | Layer3,
  changes: ProjectChanges,
  tvl: number | undefined,
) {
  if (!project.dataAvailability) return

  return {
    ...getCommonScalingEntry({ project, changes, syncStatus: undefined }),
    category: project.display.category,
    dataAvailability: project.dataAvailability,
    provider: project.display.provider,
    tvlOrder: tvl ?? 0,
  }
}

export type ScalingDataAvailabilityEntry = Exclude<
  ReturnType<typeof getScalingDataAvailabilityEntry>,
  undefined
>
