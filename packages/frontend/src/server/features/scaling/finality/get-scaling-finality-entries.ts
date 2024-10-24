import { type Layer2 } from '@l2beat/config'
import { resolvedLayer2s } from '@l2beat/config/projects'
import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { getFinality } from './get-finality'
import { type FinalityData, type FinalityProjectData } from './schema'

import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'
import { getFinalityConfigurations } from './utils/get-finality-configurations'

export type ScalingFinalityEntries = Awaited<
  ReturnType<typeof getScalingFinalityEntries>
>
export async function getScalingFinalityEntries() {
  const configurations = getFinalityConfigurations()
  const [finality, tvl, icReport, projectVerification] = await Promise.all([
    getFinality(configurations),
    getProjectsLatestTvlUsd(),
    getImplementationChangeReport(),
    getProjectsVerificationStatuses(),
  ])

  const includedProjects = getIncludedProjects(resolvedLayer2s, finality)

  const entries = includedProjects
    .map((project) => {
      const hasImplementationChanged =
        !!icReport.projects[project.id.toString()]
      const isVerified = !!projectVerification[project.id.toString()]

      return getScalingFinalityEntry(
        project,
        finality[project.id.toString()],
        isVerified,
        hasImplementationChanged,
      )
    })
    .filter(notUndefined)

  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    return {
      type: 'recategorised' as const,
      entries: groupByMainCategories(orderByStageAndTvl(entries, tvl)),
    }
  }

  return { entries: orderByTvl(entries, tvl) }
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
  hasImplementationChanged?: boolean,
) {
  return {
    entryType: 'finality' as const,
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: hasImplementationChanged ?? false,
    }),
    dataAvailabilityMode: project.dataAvailability?.mode,
    data: getFinalityData(finalityProjectData, project),
    finalizationPeriod: project.display.finality?.finalizationPeriod,
  }
}
