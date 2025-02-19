import type { Project } from '@l2beat/config'
import { ProjectId, formatSeconds, notUndefined } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import { type ThroughputData, getDaThroughput } from '../utils/get-da-throuput'
import { getThroughputSyncWarning } from './is-throughput-synced'
import { formatBytes } from './utils/formatBytes'

export async function getDaThroughputEntries(): Promise<DaThroughputEntry[]> {
  const projectsWithDaTracking = await ps.getProjects({
    select: ['daTrackingConfig'],
  })

  const uniqueDaLayersInProjects = new Set(
    projectsWithDaTracking.map((l) => l.daTrackingConfig.daLayer),
  )

  const daLayers = await ps.getProjects({
    select: ['daLayer', 'statuses'],
  })

  const daLayersWithDaTracking = daLayers.filter((p) =>
    uniqueDaLayersInProjects.has(p.id),
  )

  if (daLayersWithDaTracking.length === 0) {
    return []
  }

  const latestData = await getDaThroughput(
    daLayersWithDaTracking,
    projectsWithDaTracking,
  )

  const entries = daLayersWithDaTracking
    .map((project) => getDaThroughputEntry(project, latestData[project.id]))
    .filter(notUndefined)
  return entries
}

export interface DaThroughputEntry extends CommonProjectEntry {
  isPublic: boolean
  pastDayAvgThroughput: number | undefined
  maxThroughput: number | undefined
  pastDayAvgCapacityUtilization: number | undefined
  largestPoster:
    | {
        name: string
        percentage: number
        totalPosted: string
      }
    | undefined
  totalPosted: string | undefined
  finality: string | undefined
  isSynced: boolean
}

function getDaThroughputEntry(
  project: Project<'daLayer' | 'statuses'>,
  data: ThroughputData[string] | undefined,
): DaThroughputEntry | undefined {
  if (!data) return undefined

  const notSyncedStatus = data
    ? getThroughputSyncWarning(data.syncedUntil)
    : undefined
  return {
    id: ProjectId(project.id),
    slug: project.slug,
    name: project.name,
    nameSecondLine: project.daLayer.type,
    href: `/data-availability/projects/${project.slug}`,
    statuses: {
      underReview: project.statuses.isUnderReview ? 'config' : undefined,
      syncWarning: notSyncedStatus,
    },
    isPublic: project.daLayer.systemCategory === 'public',
    pastDayAvgThroughput: data.pastDayAvgThroughput,
    maxThroughput: data.maxThroughput,
    pastDayAvgCapacityUtilization: data.pastDayAvgCapacityUtilization,
    largestPoster: data.largestPoster
      ? {
          ...data.largestPoster,
          totalPosted: formatBytes(Number(data.largestPoster.totalPosted)),
        }
      : undefined,
    totalPosted: formatBytes(Number(data.totalPosted)),
    finality: project.daLayer.finality
      ? formatSeconds(project.daLayer.finality, {
          fullUnit: true,
        })
      : undefined,
    isSynced: !notSyncedStatus,
  }
}
