import type { DaLayerThroughput } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, notUndefined, ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import keyBy from 'lodash/keyBy'
import partition from 'lodash/partition'
import round from 'lodash/round'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'
import { sumByResolutionAndProject } from './utils/sumByResolutionAndProject'

type LargestPoster = Omit<DataAvailabilityRecord, 'configurationId'> & {
  name: string
  slug: string | undefined
}

export async function getDaThroughputTable(
  ...parameters: Parameters<typeof getDaThroughputTableData>
) {
  if (env.MOCK) {
    return getMockDaThroughputTableData(...parameters)
  }
  return await getDaThroughputTableData(...parameters)
}

export type ThroughputTableData = Awaited<
  ReturnType<typeof getDaThroughputTableData>
>
const getDaThroughputTableData = async (daLayerIds: string[]) => {
  const db = getDb()
  const lastDay = UnixTime.toStartOf(UnixTime.now(), 'day')
  const [values, maxHistoricalRecords, daLayers] = await Promise.all([
    db.dataAvailability.getByDaLayersAndTimeRange(
      THROUGHPUT_ENABLED_DA_LAYERS,
      [lastDay - 7 * UnixTime.DAY, lastDay],
    ),
    db.dataAvailability.getMaxHistoricalRecordByDaLayer(
      THROUGHPUT_ENABLED_DA_LAYERS,
    ),
    ps.getProjects({
      ids: daLayerIds.map(ProjectId),
      select: ['daLayer'],
    }),
  ])

  const sovereignProjectsNamesMap = new Map(
    daLayers.flatMap((daLayer) => {
      return (
        daLayer.daLayer.sovereignProjectsTrackingConfig?.map((p) => [
          p.projectId,
          p.name,
        ]) ?? []
      )
    }),
  )

  const maxHistoricalRecordsByDaLayer = keyBy(
    maxHistoricalRecords,
    (v) => v.daLayer,
  )

  const [daLayerValues, projectValues] = partition(values, (v) =>
    daLayerIds.includes(v.projectId),
  )
  // Grouped DA layer values
  const groupedDaLayerValues = groupBy(
    sumByResolutionAndProject(daLayerValues, 'daily'),
    (v) => v.daLayer,
  )
  // Grouped all projects values
  const groupedProjectValues = groupBy(
    sumByResolutionAndProject(projectValues, 'daily'),
    (v) => v.daLayer,
  )
  // Grouped all scaling only projects values
  const groupedScalingOnlyValues = groupBy(
    sumByResolutionAndProject(
      projectValues.filter(
        (v) => !sovereignProjectsNamesMap.has(v.projectId as ProjectId),
      ),
      'daily',
    ),
    (v) => v.daLayer,
  )
  const onlyScalingDaLayerValues = Object.fromEntries(
    daLayerIds.map((daLayer) => [
      daLayer,
      sumByTimestamp(daLayer, groupedScalingOnlyValues),
    ]),
  )

  const { all: largestPostersAll, scalingOnly: largestPostersScalingOnly } =
    await getLargestPosters(
      groupedDaLayerValues,
      groupedProjectValues,
      sovereignProjectsNamesMap,
    )

  const getData = (
    values: Record<string, Omit<DataAvailabilityRecord, 'configurationId'>[]>,
    largestPostersMap: Record<string, LargestPoster | undefined>,
  ) => {
    return Object.fromEntries(
      daLayers
        .map((daLayer) => {
          const lastDaLayerTimestamp = daLayerValues.findLast(
            (v) => v.daLayer === daLayer.id,
          )?.timestamp
          const lastRecord = values[daLayer.id]?.at(-1)
          const previousRecord = values[daLayer.id]?.at(-2)

          const latestThroughput = daLayer.daLayer.throughput
            ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
            .at(-1)

          assert(
            latestThroughput,
            'Project does not have throughput data configured',
          )

          const largestPoster = largestPostersMap[daLayer.id]
          const maxThroughputPerSecond = getMaxThroughputPerSecond(
            daLayer.id,
            latestThroughput,
          )

          const maxHistoricalRecord = maxHistoricalRecordsByDaLayer[daLayer.id]
          const maxRegistered = maxHistoricalRecord
            ? {
                value: Number(maxHistoricalRecord.totalSize) / UnixTime.HOUR,
                timestamp: maxHistoricalRecord.timestamp,
              }
            : undefined

          return [
            daLayer.id,
            {
              syncedUntil: lastDaLayerTimestamp,
              pastDayData: lastRecord
                ? getPastDayData(
                    lastRecord,
                    previousRecord,
                    largestPoster,
                    maxThroughputPerSecond === 'NO_CAP'
                      ? null
                      : maxThroughputPerSecond,
                  )
                : undefined,
              maxThroughputPerSecond,
              maxRegistered,
            },
          ] as const
        })
        .filter(notUndefined),
    )
  }

  return {
    data: getData(groupedDaLayerValues, largestPostersAll),
    scalingOnlyData: getData(
      onlyScalingDaLayerValues,
      largestPostersScalingOnly,
    ),
  }
}

function getPastDayData(
  lastRecord: Omit<DataAvailabilityRecord, 'configurationId'>,
  previousRecord: Omit<DataAvailabilityRecord, 'configurationId'> | undefined,
  largestPoster:
    | {
        readonly timestamp: UnixTime
        readonly projectId: string
        readonly daLayer: string
        readonly totalSize: bigint
        readonly name: string
        readonly slug: string | undefined
      }
    | undefined,
  maxThroughputPerSecond: number | null,
) {
  const avgThroughputPerSecond = Number(lastRecord.totalSize) / UnixTime.DAY
  const avgCapacityUtilization =
    maxThroughputPerSecond === null
      ? null
      : round((avgThroughputPerSecond / maxThroughputPerSecond) * 100, 2)

  const currentTotalPosted = Number(lastRecord.totalSize)
  const previousTotalPosted = previousRecord
    ? Number(previousRecord.totalSize)
    : 0
  const change = calculatePercentageChange(
    currentTotalPosted,
    previousTotalPosted,
  )

  return {
    totalPosted: currentTotalPosted,
    change,
    avgThroughputPerSecond,
    avgCapacityUtilization,
    largestPoster: largestPoster
      ? {
          name: largestPoster.name,
          percentage: round(
            (Number(largestPoster.totalSize) / Number(lastRecord.totalSize)) *
              100,
            2,
          ),
          totalPosted: Number(largestPoster.totalSize),
          href: largestPoster.slug
            ? `/scaling/projects/${largestPoster.slug}`
            : undefined,
        }
      : undefined,
  }
}

function getMockDaThroughputTableData(
  ...parameters: Parameters<typeof getDaThroughputTableData>
): ThroughputTableData {
  const [daLayerIds] = parameters
  return {
    data: Object.fromEntries(
      daLayerIds
        .map((daLayerId) => {
          return [
            daLayerId,
            {
              syncedUntil:
                daLayerId === 'avail'
                  ? UnixTime.toStartOf(UnixTime.now(), 'day') - 2 * UnixTime.DAY
                  : UnixTime.toStartOf(UnixTime.now(), 'day') -
                    1 * UnixTime.DAY,
              pastDayData: {
                largestPoster: {
                  name: 'Base',
                  percentage: 12,
                  totalPosted: 123123,
                  href: '/scaling/projects/base',
                },
                avgCapacityUtilization: 24,
                totalPosted: 10312412,
                change: 0.15,
                avgThroughputPerSecond: 100000,
              },
              maxThroughputPerSecond: 400000,
              maxRegistered: {
                value: 390000,
                timestamp: 1744416000,
              },
            },
          ] as const
        })
        .filter(notUndefined),
    ),
    scalingOnlyData: Object.fromEntries(
      daLayerIds
        .map((daLayerId) => {
          return [
            daLayerId,
            {
              pastDayData: {
                avgCapacityUtilization: 48,
                totalPosted: 20312412,
                change: -0.08,
                largestPoster: {
                  name: 'Base',
                  percentage: 40,
                  totalPosted: 123123,
                  href: '/scaling/projects/base',
                },
                avgThroughputPerSecond: 100000,
              },
              syncedUntil:
                daLayerId === 'avail'
                  ? UnixTime.toStartOf(UnixTime.now(), 'day') - 2 * UnixTime.DAY
                  : UnixTime.toStartOf(UnixTime.now(), 'day') -
                    1 * UnixTime.DAY,
              maxThroughputPerSecond: 400000,
              maxRegistered: {
                value: 390000,
                timestamp: 1744416000,
              },
            },
          ] as const
        })
        .filter(notUndefined),
    ),
  }
}

function getMaxThroughputPerSecond(
  daLayerId: ProjectId,
  latestThroughput: DaLayerThroughput,
): number | 'NO_CAP' {
  const isEthereum = daLayerId === ProjectId.ETHEREUM
  const size = isEthereum ? latestThroughput.target : latestThroughput.size
  assert(size, 'Project does not have throughput data configured')
  if (size === 'NO_CAP') return 'NO_CAP'
  return size / latestThroughput.frequency
}

function sumByTimestamp(
  daLayer: string,
  groupedProjectValues: Record<
    string,
    Omit<DataAvailabilityRecord, 'configurationId'>[]
  >,
): Omit<DataAvailabilityRecord, 'configurationId'>[] {
  const projectValues = groupedProjectValues[daLayer] ?? []
  const timestampedValues = groupBy(projectValues, (v) => v.timestamp)
  const values = Object.entries(timestampedValues).map(
    ([timestamp, values]) => {
      const totalSize = values.reduce((acc, v) => acc + v.totalSize, 0n)
      return {
        projectId: daLayer,
        timestamp: UnixTime(Number(timestamp)),
        totalSize,
        daLayer,
      }
    },
  )

  return values
}

async function getLargestPosters(
  groupedDaLayerValues: Record<
    string,
    Omit<DataAvailabilityRecord, 'configurationId'>[]
  >,
  groupedProjectValues: Record<
    string,
    Omit<DataAvailabilityRecord, 'configurationId'>[]
  >,
  sovereignProjectsNamesMap: Map<string, string>,
): Promise<{
  all: Record<string, LargestPoster | undefined>
  scalingOnly: Record<string, LargestPoster | undefined>
}> {
  const rawData = Object.fromEntries(
    Object.entries(groupedProjectValues)
      .map(([daLayer, values]) => {
        const lastTimestamp = groupedDaLayerValues[daLayer]?.at(-1)?.timestamp
        if (!lastTimestamp) return undefined

        const currentValues = values.filter(
          (v) => v.timestamp === lastTimestamp,
        )
        const scalingValues = currentValues.filter(
          (v) => !sovereignProjectsNamesMap.has(v.projectId),
        )

        return [
          daLayer,
          {
            all: findLargestPoster(currentValues),
            scalingOnly: findLargestPoster(scalingValues),
          },
        ] as const
      })
      .filter(notUndefined),
  )

  const projectIds = new Set<ProjectId>()
  for (const { all, scalingOnly } of Object.values(rawData)) {
    if (all) projectIds.add(ProjectId(all.projectId))
    if (scalingOnly) projectIds.add(ProjectId(scalingOnly.projectId))
  }

  const projects = await ps.getProjects({
    ids: Array.from(projectIds),
    select: ['scalingInfo'],
  })

  return {
    all: Object.fromEntries(
      Object.entries(rawData).map(([daLayer, { all }]) => [
        daLayer,
        all
          ? enrichPoster(all, projects, sovereignProjectsNamesMap, true)
          : undefined,
      ]),
    ),
    scalingOnly: Object.fromEntries(
      Object.entries(rawData).map(([daLayer, { scalingOnly }]) => [
        daLayer,
        scalingOnly
          ? enrichPoster(
              scalingOnly,
              projects,
              sovereignProjectsNamesMap,
              false,
            )
          : undefined,
      ]),
    ),
  }
}

function findLargestPoster(
  values: Omit<DataAvailabilityRecord, 'configurationId'>[],
): Omit<DataAvailabilityRecord, 'configurationId'> | undefined {
  return values.reduce(
    (largest, current) =>
      !largest || current.totalSize > largest.totalSize ? current : largest,
    undefined as Omit<DataAvailabilityRecord, 'configurationId'> | undefined,
  )
}

function enrichPoster(
  poster: Omit<DataAvailabilityRecord, 'configurationId'>,
  projects: Array<{ id: string; name: string; slug: string }>,
  sovereignProjectsNamesMap: Map<string, string>,
  allowSovereign: boolean,
): LargestPoster {
  const project = projects.find((p) => p.id === poster.projectId)
  if (project) {
    return { ...poster, name: project.name, slug: project.slug }
  }

  const sovereignName = sovereignProjectsNamesMap.get(poster.projectId)
  if (sovereignName && allowSovereign) {
    return { ...poster, name: sovereignName, slug: undefined }
  }

  throw new Error(`Project not found: ${poster.projectId}`)
}
