import {
  type Project,
  ProjectService,
  type WarningWithSentiment,
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
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import {
  type ProjectSevenDayTvlBreakdown,
  get7dTvlBreakdown,
} from './utils/get-7d-tvl-breakdown'

export async function getScalingTvlEntries() {
  const [projectsChangeReport, tvl, projects] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvlBreakdown(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'tvlInfo'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingTvlEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl.projects[project.id.toString()],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export interface ScalingTvlEntry extends CommonScalingEntry {
  tvl: {
    data: ProjectSevenDayTvlBreakdown | undefined
    associatedTokens: string[]
    warnings: WarningWithSentiment[]
  }
  tvlOrder: number
}

function getScalingTvlEntry(
  project: Project<'scalingInfo' | 'statuses' | 'tvlInfo'>,
  changes: ProjectChanges,
  data: ProjectSevenDayTvlBreakdown | undefined,
): ScalingTvlEntry | undefined {
  return {
    ...getCommonScalingEntry({ project, changes }),
    href: `/scaling/projects/${project.slug}/tvs-breakdown`,
    tvl: {
      data,
      associatedTokens: project.tvlInfo.associatedTokens,
      warnings: project.tvlInfo.warnings,
    },
    tvlOrder: data?.breakdown.total ?? -1,
  }
}
