import { ps } from '~/server/projects'
import {
  getScalingSummaryEntry,
  type ScalingSummaryEntry,
} from '../scaling/summary/get-scaling-summary-entries'
import { getActivityLatestUops } from '../scaling/activity/get-activity-latest-tps'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { get7dTvsBreakdown } from '../scaling/tvs/utils/get-7d-tvs-breakdown'
import type { ProjectEcosystemConfig } from '@l2beat/config'
import { compareStageAndTvs } from '../scaling/utils/compare-stage-and-tvs'

export interface EcosystemProjectEntry {
  slug: string
  name: string
  colors: ProjectEcosystemConfig['colors']
  projects: ScalingSummaryEntry[]
}

export async function getEcosystemProjectEntry(
  slug: string,
): Promise<EcosystemProjectEntry | undefined> {
  const ecosystem = await ps.getProject({
    slug,
    select: ['ecosystemConfig'],
  })

  if (!ecosystem) {
    return undefined
  }

  const projects = await ps.getProjects({
    select: [
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'display',
      'ecosystemInfo',
    ],
    optional: ['tvlInfo', 'scalingDa', 'scalingStage', 'chainConfig'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })
  const [projectsChangeReport, tvs, projectsActivity] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown({ type: 'layer2' }),
    getActivityLatestUops(projects),
  ])

  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )

  return {
    ...ecosystem,
    colors: ecosystem.ecosystemConfig.colors,
    projects: ecosystemProjects
      .map((project) =>
        getScalingSummaryEntry(
          project,
          projectsChangeReport.getChanges(project.id),
          tvs.projects[project.id.toString()],
          projectsActivity[project.id.toString()],
        ),
      )
      .sort(compareStageAndTvs),
  }
}
