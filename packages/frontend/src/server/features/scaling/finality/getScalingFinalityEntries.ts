import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingStack,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import { getProjectsLatestTvsUsd } from '../tvs/getLatestTvsUsd'
import { compareStageAndTvs } from '../utils/compareStageAndTvs'
import { getFinality } from './getFinality'
import type { FinalityProjectData } from './schema'
import { getFinalitySyncWarning } from './utils/isFinalitySynced'

export async function getFinalityProjects() {
  const projects = await ps.getProjects({
    select: [
      'statuses',
      'scalingInfo',
      'finalityInfo',
      'finalityConfig',
      'display',
    ],
    optional: ['scalingDa'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  return projects
}

export async function getScalingFinalityEntries() {
  const projects = await getFinalityProjects()

  const [finality, tvs, projectsChangeReport] = await Promise.all([
    getFinality(projects),
    getProjectsLatestTvsUsd(),
    getProjectsChangeReport(),
  ])

  const entries = projects
    .map((project) =>
      getScalingFinalityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        finality[project.id.toString()],
        tvs[project.id],
      ),
    )
    .filter((x) => x !== undefined)
    .sort(compareStageAndTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingFinalityEntry extends CommonScalingEntry {
  category: ProjectScalingCategory
  stacks: ProjectScalingStack[] | undefined
  dataAvailabilityMode: TableReadyValue | undefined
  data: {
    timeToInclusion: {
      averageInSeconds: number
      minimumInSeconds: number | undefined
      maximumInSeconds: number
      warning: WarningWithSentiment | undefined
    }
    stateUpdateDelay:
      | {
          averageInSeconds: number
          warning: WarningWithSentiment | undefined
        }
      | undefined
    isSynced: boolean
  }
  finalizationPeriod: number | undefined
  tvsOrder: number
}

function getScalingFinalityEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'finalityInfo' | 'display',
    'scalingDa'
  >,
  changes: ProjectChanges,
  finalityProjectData: FinalityProjectData | undefined,
  tvs: number | undefined,
): ScalingFinalityEntry | undefined {
  if (!finalityProjectData) {
    return
  }

  const syncWarning = getFinalitySyncWarning(finalityProjectData.syncedUntil)

  return {
    ...getCommonScalingEntry({ project, changes, syncWarning }),
    category: project.scalingInfo.type,
    stacks: project.scalingInfo.stacks,
    dataAvailabilityMode: project.scalingDa?.mode,
    data: {
      timeToInclusion: {
        averageInSeconds: finalityProjectData.timeToInclusion.averageInSeconds,
        minimumInSeconds: finalityProjectData.timeToInclusion.minimumInSeconds,
        maximumInSeconds: finalityProjectData.timeToInclusion.maximumInSeconds,
        warning: project.finalityInfo?.warnings?.timeToInclusion,
      },
      stateUpdateDelay: finalityProjectData.stateUpdateDelays
        ? {
            averageInSeconds:
              finalityProjectData.stateUpdateDelays.averageInSeconds,
            warning: project.finalityInfo?.warnings?.stateUpdateDelay,
          }
        : undefined,
      isSynced: !syncWarning,
    },
    finalizationPeriod: project.finalityInfo.finalizationPeriod,
    tvsOrder: tvs ?? -1,
  }
}
