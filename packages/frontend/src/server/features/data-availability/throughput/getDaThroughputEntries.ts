import type { Project } from '@l2beat/config'
import { formatSeconds, notUndefined, UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { type CommonDaEntry, getCommonDaEntry } from '../getCommonDaEntry'
import {
  getDaThroughputTable,
  type ThroughputTableData,
} from './getDaThroughputTable'
import { getThroughputSyncWarning } from './isThroughputSynced'

export async function getDaThroughputEntries(): Promise<DaThroughputEntry[]> {
  const [daLayers, daBridges] = await Promise.all([
    ps.getProjects({ select: ['daLayer', 'statuses'] }),
    ps.getProjects({ select: ['daBridge'] }),
  ])

  const daLayersWithDaTracking = daLayers.filter((d) => d.daLayer.throughput)

  if (daLayersWithDaTracking.length === 0) {
    return []
  }
  const daLayerIds = daLayersWithDaTracking.map((p) => p.id)

  const latestData = await getDaThroughputTable(daLayerIds)

  const entries = daLayersWithDaTracking
    .map((project) =>
      getDaThroughputEntry(
        project,
        daBridges,
        latestData.data[project.id],
        latestData.scalingOnlyData[project.id],
      ),
    )
    .filter(notUndefined)
    .sort(
      (a, b) =>
        (b.scalingOnlyData?.pastDayData?.avgThroughputPerSecond ?? 0) -
        (a.scalingOnlyData?.pastDayData?.avgThroughputPerSecond ?? 0),
    )
  return entries
}

interface DaThroughputEntryData {
  /**
   * @unit B/s - bytes per second
   */
  maxThroughputPerSecond: number | 'NO_CAP'
  maxRegistered:
    | {
        value: number
        timestamp: number
      }
    | undefined
  pastDayData:
    | {
        /**
         * @unit B/s - bytes per second
         */
        avgThroughputPerSecond: number
        avgCapacityUtilization: number | null
        totalPosted: number
        change: number
        largestPoster:
          | {
              name: string
              href?: string
              percentage: number
              totalPosted: number
            }
          | undefined
      }
    | undefined
}

export interface DaThroughputEntry extends CommonDaEntry {
  data: DaThroughputEntryData | undefined
  scalingOnlyData: DaThroughputEntryData | undefined
  finality: string | undefined
  isSynced: boolean
}

function getDaThroughputEntry(
  project: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge'>[],
  data: ThroughputTableData['data'][string] | undefined,
  scalingOnlyData: ThroughputTableData['scalingOnlyData'][string] | undefined,
): DaThroughputEntry | undefined {
  const bridge = bridges.find((x) => x.daBridge.daLayer === project.id)
  const syncWarning = data?.syncedUntil
    ? getThroughputSyncWarning(UnixTime(data.syncedUntil), {
        pastDaySynced: true,
      })
    : undefined
  const href = `/data-availability/projects/${project.slug}/${bridge ? bridge.slug : 'no-bridge'}`
  return {
    ...getCommonDaEntry({ project, href, syncWarning }),
    finality: project.daLayer.finality
      ? formatSeconds(project.daLayer.finality, {
          fullUnit: true,
        })
      : undefined,
    data,
    scalingOnlyData,
    isSynced: !syncWarning,
  }
}
