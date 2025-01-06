import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import {
  type SevenDayTvlBreakdown,
  get7dTvlBreakdown,
} from './utils/get-7d-tvl-breakdown'

export async function getScalingTvlEntries() {
  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )

  const [projectsChangeReport, tvl] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvlBreakdown(),
  ])

  const entries = projects
    .map((project) =>
      getScalingTvlEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl.projects[project.id.toString()],
      ),
    )
    .filter((entry) => entry.tvl.data)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export type ScalingTvlEntry = Awaited<ReturnType<typeof getScalingTvlEntry>>
function getScalingTvlEntry(
  project: Layer2 | Layer3,
  changes: ProjectChanges,
  latestTvl: SevenDayTvlBreakdown['projects'][string] | undefined,
) {
  return {
    ...getCommonScalingEntry({ project, changes, syncStatus: undefined }),
    href: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
    tvl: {
      data: latestTvl && {
        total: latestTvl.total,
        breakdown: latestTvl.breakdown,
        change: latestTvl.change,
        associatedTokensExcludedChange:
          latestTvl.associatedTokensExcludedChange,
      },
      associatedTokens: project.config.associatedTokens ?? [],
      warnings: [project.display.tvlWarning].filter(notUndefined),
    },
    tvlOrder:
      (latestTvl?.breakdown.canonical ?? 0) +
      (latestTvl?.breakdown.native ?? 0) +
      (latestTvl?.breakdown.external ?? 0),
  }
}
