import type {
  Project,
  ProjectDataAvailability,
  ScalingProjectCategory,
  ScalingProjectStack,
} from '@l2beat/config'
import { groupByScalingTabs } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'

export async function getScalingDaEntries() {
  const [tvs, projectsChangeReport, projects, daLayers] = await Promise.all([
    getProjectsLatestTvsUsd(),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingDa', 'display'],
      optional: ['customDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
    ps.getProjects({
      select: ['daLayer'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingDaEntry(
        project,
        daLayers,
        projectsChangeReport.getChanges(project.id),
        tvs[project.id],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingDaEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  dataAvailability: ProjectDataAvailability
  stack: ScalingProjectStack | undefined
  tvsOrder: number
  daHref: string | undefined
}

function getScalingDaEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa'
  >,
  daLayers: Project<'daLayer'>[],
  changes: ProjectChanges,
  tvs: number | undefined,
): ScalingDaEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    category: project.scalingInfo.type,
    dataAvailability: project.scalingDa,
    daHref: getDaHref(project, daLayers),
    stack: project.scalingInfo.stack,
    tvsOrder: tvs ?? -1,
  }
}

function getDaHref(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa'
  >,
  daLayers: Project<'daLayer'>[],
) {
  if (project.customDa) {
    return `/data-availability/summary?tab=custom&highlight=${project.slug}`
  }

  const daLayer = daLayers.find(
    (l) => l.id === project.scalingDa.layer.projectId,
  )

  if (!daLayer) {
    return undefined
  }

  return `/data-availability/summary?tab=${daLayer.daLayer.systemCategory}&highlight=${daLayer.slug}`
}
