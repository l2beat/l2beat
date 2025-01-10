import { ProjectService, type ProjectWith } from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCommonScalingEntry2 } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingDaEntries() {
  const [tvl, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingDa'],
      optional: ['countdowns'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingDataAvailabilityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl[project.id] ?? 0,
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

function getScalingDataAvailabilityEntry(
  project: ProjectWith<'scalingInfo' | 'statuses' | 'scalingDa', 'countdowns'>,
  changes: ProjectChanges,
  tvl: number,
) {
  return {
    ...getCommonScalingEntry2({ project, changes, syncStatus: undefined }),
    category: project.scalingInfo.type,
    dataAvailability: project.scalingDa,
    provider: project.scalingInfo.stack,
    tvlOrder: tvl,
  }
}

export type ScalingDataAvailabilityEntry = Exclude<
  ReturnType<typeof getScalingDataAvailabilityEntry>,
  undefined
>
