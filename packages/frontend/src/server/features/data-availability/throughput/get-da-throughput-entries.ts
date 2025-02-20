import type { Project } from '@l2beat/config'
import {
  ProjectId,
  UnixTime,
  formatSeconds,
  notUndefined,
} from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import {
  type ThroughputTableData,
  getDaThroughputTable,
} from './get-da-throughput-table'
import { getThroughputSyncWarning } from './is-throughput-synced'

export async function getDaThroughputEntries(): Promise<DaThroughputEntry[]> {
  const projectsWithDaTracking = await ps.getProjects({
    select: ['daTrackingConfig'],
  })

  const uniqueDaLayersInProjects = new Set(
    projectsWithDaTracking.flatMap((l) =>
      l.daTrackingConfig.map((d) => d.daLayer),
    ),
  )

  const [daLayers, daBridges] = await Promise.all([
    ps.getProjects({ select: ['daLayer', 'statuses'] }),
    ps.getProjects({ select: ['daBridge'] }),
  ])

  const daLayersWithDaTracking = daLayers.filter((p) =>
    uniqueDaLayersInProjects.has(p.id),
  )

  if (daLayersWithDaTracking.length === 0) {
    return []
  }

  const latestData = await getDaThroughputTable(
    daLayersWithDaTracking,
    projectsWithDaTracking,
  )

  const entries = daLayersWithDaTracking
    .map((project) =>
      getDaThroughputEntry(project, daBridges, latestData[project.id]),
    )
    .filter(notUndefined)
  return entries
}

export interface DaThroughputEntry extends CommonProjectEntry {
  isPublic: boolean
  /**
   * @unit B/s - bytes per second
   */
  pastDayAvgThroughputPerSecond: number | undefined
  /**
   * @unit B/s - bytes per second
   */
  maxThroughputPerSecond: number | undefined
  pastDayAvgCapacityUtilization: number | undefined
  largestPoster:
    | {
        name: string
        percentage: number
        totalPosted: number
      }
    | undefined
  totalPosted: number | undefined
  finality: string | undefined
  isSynced: boolean
}

function getDaThroughputEntry(
  project: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge'>[],
  data: ThroughputTableData[string] | undefined,
): DaThroughputEntry | undefined {
  if (!data) return undefined

  const bridge = bridges.find((x) => x.daBridge.daLayer === project.id)
  const notSyncedStatus = data
    ? getThroughputSyncWarning(new UnixTime(data.syncedUntil))
    : undefined
  return {
    id: ProjectId(project.id),
    slug: project.slug,
    name: project.name,
    nameSecondLine: project.daLayer.type,
    href: `/data-availability/projects/${project.slug}/${bridge ? bridge.slug : 'no-bridge'}`,
    statuses: {
      underReview: project.statuses.isUnderReview ? 'config' : undefined,
      syncWarning: notSyncedStatus,
    },
    isPublic: project.daLayer.systemCategory === 'public',
    pastDayAvgThroughputPerSecond: data.pastDayAvgThroughputPerSecond,
    maxThroughputPerSecond: data.maxThroughputPerSecond,
    pastDayAvgCapacityUtilization: data.pastDayAvgCapacityUtilization,
    largestPoster: data.largestPoster
      ? {
          ...data.largestPoster,
          totalPosted: Number(data.largestPoster.totalPosted),
        }
      : undefined,
    totalPosted: Number(data.totalPosted),
    finality: project.daLayer.finality
      ? formatSeconds(project.daLayer.finality, {
          fullUnit: true,
        })
      : undefined,
    isSynced: !notSyncedStatus,
  }
}
