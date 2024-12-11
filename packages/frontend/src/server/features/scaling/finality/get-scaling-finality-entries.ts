import { type Layer2, layer2s } from '@l2beat/config'
import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { getFinality } from './get-finality'
import { type FinalityData, type FinalityProjectData } from './schema'

import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCurrentEntry } from '../../utils/get-current-entry'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import { getFinalityConfigurations } from './utils/get-finality-configurations'

export type ScalingFinalityEntries = Awaited<
  ReturnType<typeof getScalingFinalityEntries>
>
export async function getScalingFinalityEntries() {
  const configurations = getFinalityConfigurations()
  const [finality, tvl, projectsChangeReport, projectsVerificationStatuses] =
    await Promise.all([
      getFinality(configurations),
      getProjectsLatestTvlUsd(),
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
    ])

  const includedProjects = getIncludedProjects(layer2s, finality)

  const entries = includedProjects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]

      return getScalingFinalityEntry(
        project,
        finality[project.id.toString()],
        isVerified,
        projectsChangeReport,
        tvl,
      )
    })
    .filter(notUndefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

function getFinalityData(
  finalityProjectData: FinalityProjectData | undefined,
  project: Layer2,
) {
  if (!finalityProjectData) {
    return
  }

  const data = {
    timeToInclusion: {
      averageInSeconds: finalityProjectData.timeToInclusion.averageInSeconds,
      minimumInSeconds: finalityProjectData.timeToInclusion.minimumInSeconds,
      maximumInSeconds: finalityProjectData.timeToInclusion.maximumInSeconds,
      warning: project.display.finality?.warnings?.timeToInclusion,
    },
    stateUpdateDelay: finalityProjectData.stateUpdateDelays
      ? {
          averageInSeconds:
            finalityProjectData.stateUpdateDelays.averageInSeconds,
          warning: project.display.finality?.warnings?.stateUpdateDelay,
        }
      : undefined,
    syncStatus: {
      isSynced: isSynced(finalityProjectData.syncedUntil),
      syncedUntil: finalityProjectData.syncedUntil,
    },
  }

  return data
}

function isSynced(syncedUntil: number) {
  return UnixTime.now()
    .add(-1, 'days')
    .add(-1, 'hours')
    .lte(new UnixTime(syncedUntil))
}

function getIncludedProjects(projects: Layer2[], finality: FinalityData) {
  return projects.filter(
    (p) =>
      !p.isUpcoming &&
      !p.isArchived &&
      (p.config.finality ?? finality[p.id.toString()]) &&
      (p.display.category === 'ZK Rollup' ||
        p.display.category === 'Optimistic Rollup'),
  )
}

export type ScalingFinalityEntry = ReturnType<typeof getScalingFinalityEntry>
function getScalingFinalityEntry(
  project: Layer2,
  finalityProjectData: FinalityProjectData | undefined,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
  tvl: ProjectsLatestTvlUsd,
) {
  const dataAvailability = getCurrentEntry(project.dataAvailability)
  const data = getFinalityData(finalityProjectData, project)
  return {
    entryType: 'finality' as const,
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      syncStatus: data?.syncStatus,
    }),
    dataAvailabilityMode: dataAvailability?.mode,
    data,
    finalizationPeriod: project.display.finality?.finalizationPeriod,
    tvlOrder: tvl[project.id] ?? 0,
  }
}
