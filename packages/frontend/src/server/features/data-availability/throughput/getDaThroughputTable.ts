import type { DaLayerThroughput } from '@l2beat/config'
import type { DataAvailabilityRecord2 } from '@l2beat/database'
import { assert, ProjectId, UnixTime, notUndefined } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import round from 'lodash/round'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { sumByResolutionAndProject } from './utils/sumByResolutionAndProject'

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
    db.dataAvailability2.getByDaLayersAndTimeRange(daLayerIds, [
      lastDay - 7 * UnixTime.DAY,
      lastDay,
    ]),
    ps.getProjects({
      ids: daLayerIds.map(ProjectId),
      select: ['daLayer'],
    }),
  ])

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

  const largestPosters = await getLargestPosters(
    groupedDaLayerValues,
    groupedProjectValues,
  )

  const getData = (
    values: Record<string, Omit<DataAvailabilityRecord2, 'configurationId'>[]>,
  ) => {
    return Object.fromEntries(
      daLayers
        .map((daLayer) => {
          const lastRecord = values[daLayer.id]?.at(-1)

          const latestThroughput = daLayer.daLayer.throughput
            ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
            .at(-1)

          assert(
            latestThroughput,
            'Project does not have throughput data configured',
          )

          const largestPoster = largestPosters[daLayer.id]
          const pastDayAvgThroughputPerSecond = lastRecord
            ? Number(lastRecord.totalSize) / UnixTime.DAY
            : undefined
          const maxThroughputPerSecond = getMaxThroughputPerSecond(
            daLayer.id,
            latestThroughput,
          )
          const pastDayAvgCapacityUtilization = pastDayAvgThroughputPerSecond
            ? round(
                (pastDayAvgThroughputPerSecond / maxThroughputPerSecond) * 100,
                2,
              )
            : undefined

          return [
            daLayer.id,
            {
              totalSize: lastRecord ? Number(lastRecord.totalSize) : undefined,
              syncedUntil: lastRecord ? lastRecord.timestamp : undefined,
              pastDayAvgThroughputPerSecond,
              largestPoster:
                largestPoster && lastRecord
                  ? {
                      name: largestPoster.name,
                      percentage: round(
                        (Number(largestPoster.totalSize) /
                          Number(lastRecord.totalSize)) *
                          100,
                        2,
                      ),
                      totalPosted: Number(largestPoster.totalSize),
                      href: `/scaling/projects/${largestPoster.slug}`,
                    }
                  : undefined,
              maxThroughputPerSecond,
              pastDayAvgCapacityUtilization,
              totalPosted: lastRecord
                ? Number(lastRecord.totalSize)
                : undefined,
            },
          ] as const
        })
        .filter(notUndefined),
    )
  }

  return {
    data: getData(groupedDaLayerValues),
    scalingOnlyData: getData(onlyScalingDaLayerValues),
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
              totalSize: 101312,
              syncedUntil:
                daLayerId === 'avail'
                  ? UnixTime.toStartOf(UnixTime.now(), 'day') - 2 * UnixTime.DAY
                  : UnixTime.toStartOf(UnixTime.now(), 'day') -
                    1 * UnixTime.DAY,
              pastDayAvgThroughputPerSecond: 1.5,
              maxThroughputPerSecond: 4.3,
              largestPoster: {
                name: 'Base',
                percentage: 12,
                totalPosted: 123123,
                href: '/scaling/projects/base',
              },
              pastDayAvgCapacityUtilization: 24,
              totalPosted: 10312412,
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
              totalSize: 601312,
              syncedUntil:
                daLayerId === 'avail'
                  ? UnixTime.toStartOf(UnixTime.now(), 'day') - 2 * UnixTime.DAY
                  : UnixTime.toStartOf(UnixTime.now(), 'day') -
                    1 * UnixTime.DAY,
              pastDayAvgThroughputPerSecond: 1.0,
              maxThroughputPerSecond: 4.3,
              largestPoster: {
                name: 'Base',
                percentage: 40,
                totalPosted: 123123,
                href: '/scaling/projects/base',
              },
              pastDayAvgCapacityUtilization: 48,
              totalPosted: 20312412,
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
    Omit<DataAvailabilityRecord2, 'configurationId'>[]
  >,
): Omit<DataAvailabilityRecord2, 'configurationId'>[] {
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
    Omit<DataAvailabilityRecord2, 'configurationId'>[]
  >,
  groupedProjectValues: Record<
    string,
    Omit<DataAvailabilityRecord2, 'configurationId'>[]
  >,
) {
  const largestPosters = Object.fromEntries(
    Object.entries(groupedProjectValues)
      .map(([daLayer, values]) => {
        let largestPoster = undefined
        const lastTimestamp = groupedDaLayerValues[daLayer]?.at(-1)?.timestamp
        if (!lastTimestamp) {
          return undefined
        }

        const filteredValues = values.filter(
          (v) => v.timestamp === lastTimestamp,
        )

        for (const value of filteredValues) {
          if (!largestPoster || value.totalSize > largestPoster.totalSize) {
            largestPoster = value
          }
        }
        if (!largestPoster) {
          return undefined
        }
        return [daLayer, largestPoster] as const
      })
      .filter(notUndefined),
  )

  const largestPostersProjects = await ps.getProjects({
    ids: Object.values(largestPosters).map((p) => ProjectId(p.projectId)),
    select: ['scalingInfo'],
  })

  return Object.fromEntries(
    Object.entries(largestPosters).map(([daLayer, largestPoster]) => {
      const largestPosterProject = largestPostersProjects.find(
        (p) => p.id === largestPoster.projectId,
      )
      assert(largestPosterProject, 'Project not found')
      return [
        daLayer,
        {
          name: largestPosterProject.name,
          slug: largestPosterProject.slug,
          ...largestPoster,
        },
      ] as const
    }),
  )
}
