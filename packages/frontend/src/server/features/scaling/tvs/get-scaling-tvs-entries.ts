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
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'
import {
  type ProjectSevenDayTvsBreakdown,
  get7dTvsBreakdown,
} from './utils/get-7d-tvs-breakdown'

export async function getScalingTvsEntries() {
  const [projectsChangeReport, tvs, projects] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'tvlInfo'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingTvsEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id.toString()],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvs)

  return groupByTabs(entries)
}

export interface ScalingTvsEntry extends CommonScalingEntry {
  tvs: {
    data: ProjectSevenDayTvsBreakdown | undefined
    associatedTokens: string[]
    warnings: WarningWithSentiment[]
  }
  tvsOrder: number
}

function getScalingTvsEntry(
  project: Project<'scalingInfo' | 'statuses' | 'tvlInfo'>,
  changes: ProjectChanges,
  data: ProjectSevenDayTvsBreakdown | undefined,
): ScalingTvsEntry | undefined {
  return {
    ...getCommonScalingEntry({ project, changes }),
    href: `/scaling/projects/${project.slug}/tvs-breakdown`,
    tvs: {
      data,
      associatedTokens: project.tvlInfo.associatedTokens,
      warnings: project.tvlInfo.warnings,
    },
    tvsOrder: data?.breakdown.total ?? -1,
  }
}
