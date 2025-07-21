import type { Project, WarningWithSentiment } from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import { getApprovedOngoingAnomalies } from '../liveness/getApprovedOngoingAnomalies'
import { compareStageAndTvs } from '../utils/compareStageAndTvs'
import type { ProjectSevenDayTvsBreakdown } from './get7dTvsBreakdown'
import { get7dTvsBreakdown } from './get7dTvsBreakdown'

export async function getScalingTvsEntries() {
  const [projectsChangeReport, tvs, projects, projectsOngoingAnomalies] =
    await Promise.all([
      getProjectsChangeReport(),
      get7dTvsBreakdown({ type: 'layer2' }),
      ps.getProjects({
        select: ['statuses', 'scalingInfo', 'tvsInfo', 'display'],
        where: ['isScaling'],
        whereNot: ['isUpcoming', 'archivedAt'],
      }),
      getApprovedOngoingAnomalies(),
    ])

  const entries = projects
    .map((project) =>
      getScalingTvsEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id.toString()],
        !!projectsOngoingAnomalies[project.id.toString()],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvs)

  return groupByScalingTabs(entries)
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
  project: Project<'scalingInfo' | 'statuses' | 'tvsInfo' | 'display'>,
  changes: ProjectChanges,
  data: ProjectSevenDayTvsBreakdown | undefined,
  ongoingAnomaly: boolean,
): ScalingTvsEntry | undefined {
  return {
    ...getCommonScalingEntry({ project, changes, ongoingAnomaly }),
    tvs: {
      data,
      associatedTokens: project.tvsInfo.associatedTokens,
      warnings: project.tvsInfo.warnings,
    },
    tvsOrder: data?.breakdown.total ?? -1,
  }
}
