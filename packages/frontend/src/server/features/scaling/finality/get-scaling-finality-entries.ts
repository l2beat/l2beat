import type {
  Project,
  ScalingProjectCategory,
  ScalingProjectStack,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import { ps } from '~/server/projects'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'
import { getFinality } from './get-finality'
import type { FinalityProjectData } from './schema'
import { getFinalitySyncWarning } from './utils/is-finality-synced'

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
    whereNot: ['isUpcoming', 'isArchived'],
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

  return groupByTabs(entries)
}

export interface ScalingFinalityEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  stack: ScalingProjectStack | undefined
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
    stack: project.scalingInfo.stack,
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
