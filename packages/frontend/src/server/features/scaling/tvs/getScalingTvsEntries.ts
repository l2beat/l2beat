import type {
  Project,
  ProjectAssociatedToken,
  WarningWithSentiment,
} from '@l2beat/config'
import compact from 'lodash/compact'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import type { ProjectSevenDayTvsBreakdown } from './get7dTvsBreakdown'
import { get7dTvsBreakdown } from './get7dTvsBreakdown'
import { compareTvs } from './utils/compareTvs'
import { getAssociatedTokenWarning } from './utils/getAssociatedTokenWarning'

export async function getScalingTvsEntries() {
  const [projectsChangeReport, tvs, projects] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown({ type: 'layer2' }),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'tvsInfo', 'display'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
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
    .sort(compareTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingTvsEntry extends CommonScalingEntry {
  tvs: {
    associatedTokens: ProjectAssociatedToken[]
    warnings: WarningWithSentiment[]
  }
  tvsOrder: number
}

function getScalingTvsEntry(
  project: Project<'scalingInfo' | 'statuses' | 'tvsInfo' | 'display'>,
  changes: ProjectChanges,
  data: ProjectSevenDayTvsBreakdown | undefined,
): ScalingTvsEntry | undefined {
  const associatedTokenWarning =
    data?.breakdown && data.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio: data.breakdown.associated / data.breakdown.total,
          name: project.name,
          associatedTokens: project.tvsInfo?.associatedTokens ?? [],
        })
      : undefined

  return {
    ...getCommonScalingEntry({ project, changes }),
    tvs: {
      associatedTokens: project.tvsInfo.associatedTokens,
      warnings: compact([
        ...project.tvsInfo.warnings,
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
    },
    tvsOrder: data?.breakdown.total ?? -1,
  }
}
