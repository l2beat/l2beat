import type { DaLayerThroughput } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, notUndefined, ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
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
  const [values, daLayers] = await Promise.all([
    db.dataAvailability.getByDaLayersAndTimeRange(
      THROUGHPUT_ENABLED_DA_LAYERS,
      [lastDay - 7 * UnixTime.DAY, lastDay],
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

  const [daLayerValues, projectValues] = partition(values, (v) =>
    daLayerIds.includes(v.projectId),
  )
  const groupedDaLayerValues = groupBy(
    sumByResolutionAndProject(daLayerValues, 'daily'),
    (v) => v.daLayer,
  )
  const groupedProjectValues = groupBy(
    sumByResolutionAndProject(projectValues, 'daily'),
    (v) => v.daLayer,
  )
  const onlyScalingDaLayerValues = Object.fromEntries(
    daLayerIds.map((daLayer) => [
      daLayer,
      sumByTimestamp(daLayer, groupedProjectValues),
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

          return [
            daLayer.id,
            {
              syncedUntil: lastDaLayerTimestamp,
              pastDayData: lastRecord
                ? getPastDayData(
                    lastRecord,
                    previousRecord,
                    largestPoster,
                    maxThroughputPerSecond,
                  )
                : undefined,
              maxThroughputPerSecond,
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
  maxThroughputPerSecond: number,
) {
  const avgThroughputPerSecond = Number(lastRecord.totalSize) / UnixTime.DAY
  const avgCapacityUtilization = round(
    (avgThroughputPerSecond / maxThroughputPerSecond) * 100,
    2,
  )

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
) {
  const isEthereum = daLayerId === ProjectId.ETHEREUM
  const size = isEthereum ? latestThroughput.target : latestThroughput.size
  assert(size, 'Project does not have throughput data configured')
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
  const largestPostersRaw = Object.fromEntries(
    Object.entries(groupedProjectValues)
      .map(([daLayer, values]) => {
        let largestPosterAll = undefined
        let largestPosterScalingOnly = undefined
        const lastTimestamp = groupedDaLayerValues[daLayer]?.at(-1)?.timestamp
        if (!lastTimestamp) {
          return undefined
        }

        const filteredValues = values.filter(
          (v) => v.timestamp === lastTimestamp,
        )

        for (const value of filteredValues) {
          // Find largest poster including all projects
          if (
            !largestPosterAll ||
            value.totalSize > largestPosterAll.totalSize
          ) {
            largestPosterAll = value
          }
          // Find largest poster excluding sovereign projects
          if (
            !largestPosterScalingOnly ||
            (!sovereignProjectsNamesMap.has(value.projectId) &&
              value.totalSize > largestPosterScalingOnly.totalSize)
          ) {
            largestPosterScalingOnly = value
          }
        }

        return [
          daLayer,
          { all: largestPosterAll, scalingOnly: largestPosterScalingOnly },
        ] as const
      })
      .filter(notUndefined),
  )

  const allProjectIds = new Set<string>()
  for (const { all, scalingOnly } of Object.values(largestPostersRaw)) {
    if (all) allProjectIds.add(all.projectId)
    if (scalingOnly) allProjectIds.add(scalingOnly.projectId)
  }

  const largestPostersProjects = await ps.getProjects({
    ids: Array.from(allProjectIds) as ProjectId[],
    select: ['scalingInfo'],
  })

  const enrichPoster = (
    poster: Omit<DataAvailabilityRecord, 'configurationId'>,
    allowSovereign: boolean,
  ) => {
    const project = largestPostersProjects.find(
      (p) => p.id === poster.projectId,
    )
    if (project) {
      return {
        name: project.name,
        slug: project.slug,
        ...poster,
      }
    }

    const sovereignProject = sovereignProjectsNamesMap.get(poster.projectId)
    if (sovereignProject && allowSovereign) {
      return {
        name: sovereignProject,
        slug: undefined,
        ...poster,
      }
    }

    throw new Error(
      `Project not found in config or in sovereign projects list: ${poster.projectId}`,
    )
  }

  return {
    all: Object.fromEntries(
      Object.entries(largestPostersRaw).map(([daLayer, { all }]) => [
        daLayer,
        all ? enrichPoster(all, true) : undefined,
      ]),
    ),
    scalingOnly: Object.fromEntries(
      Object.entries(largestPostersRaw).map(([daLayer, { scalingOnly }]) => [
        daLayer,
        scalingOnly ? enrichPoster(scalingOnly, false) : undefined,
      ]),
    ),
  }
}
