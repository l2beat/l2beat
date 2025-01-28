import {
  type DataAvailabilityMode,
  type Project,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
  type WarningValueWithSentiment,
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
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import { getFinality } from './get-finality'
import { type FinalityProjectData } from './schema'
import { getFinalitySyncWarning } from './utils/is-finality-synced'

export async function getFinalityProjects() {
  const projects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo', 'finalityInfo', 'finalityConfig'],
    optional: ['scalingDa'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })

  return projects
}

export async function getScalingFinalityEntries() {
  const projects = await getFinalityProjects()

  const [finality, tvl, projectsChangeReport] = await Promise.all([
    getFinality(projects),
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  const entries = projects
    .map((project) =>
      getScalingFinalityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        finality[project.id.toString()],
        tvl[project.id],
      ),
    )
    .filter((x) => x !== undefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export interface ScalingFinalityEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  stack: ScalingProjectStack | undefined
  dataAvailabilityMode: DataAvailabilityMode | undefined
  data: {
    timeToInclusion: {
      averageInSeconds: number
      minimumInSeconds: number | undefined
      maximumInSeconds: number
      warning: WarningValueWithSentiment | undefined
    }
    stateUpdateDelay:
      | {
          averageInSeconds: number
          warning: WarningValueWithSentiment | undefined
        }
      | undefined
    isSynced: boolean
  }
  finalizationPeriod: number | undefined
  tvlOrder: number
}

function getScalingFinalityEntry(
  project: Project<'scalingInfo' | 'statuses' | 'finalityInfo', 'scalingDa'>,
  changes: ProjectChanges,
  finalityProjectData: FinalityProjectData | undefined,
  tvl: number | undefined,
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
    tvlOrder: tvl ?? -1,
  }
}
