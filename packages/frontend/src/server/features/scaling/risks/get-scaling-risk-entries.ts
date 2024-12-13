import {
  type Layer2,
  type Layer3,
  type ScalingProjectRiskView,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingRiskEntries() {
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  const includedProjects = [...layer2s, ...layer3s].filter(
    (p) => !p.isUpcoming && !p.isArchived,
  )

  const entries = includedProjects
    .map((project) =>
      getScalingRiskEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl,
      ),
    )
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export interface ScalingRiskEntry extends CommonScalingEntry {
  risks: ScalingProjectRiskView
  tvlOrder: number
}

function getScalingRiskEntry(
  project: Layer2 | Layer3,
  changes: ProjectChanges,
  tvl: ProjectsLatestTvlUsd,
) {
  return {
    ...getCommonScalingEntry({ project, changes, syncStatus: undefined }),
    risks:
      project.type === 'layer3' ? project.stackedRiskView : project.riskView,
    tvlOrder: tvl[project.id] ?? 0,
  }
}
