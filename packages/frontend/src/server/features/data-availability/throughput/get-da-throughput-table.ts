import type { DaLayerThroughput } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime, notUndefined } from '@l2beat/shared-pure'
import { groupBy, partition, round } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export async function getDaThroughputTable(
  ...parameters: Parameters<typeof getCachedDaThroughputTableData>
) {
  if (env.MOCK) {
    return getMockDaThroughputTableData(...parameters)
  }
  return getCachedDaThroughputTableData(...parameters)
}

export type ThroughputTableData = Awaited<
  ReturnType<typeof getCachedDaThroughputTableData>
>
const getCachedDaThroughputTableData = cache(
  async (daLayerIds: string[], opts?: { scalingProjectsOnly?: boolean }) => {
    const db = getDb()
    const lastDay = UnixTime.now().toStartOf('day').add(-1, 'days')
    const [values, daLayers] = await Promise.all([
      db.dataAvailability.getByDaLayersAndTimeRange(daLayerIds, [
        lastDay.add(-7, 'days'),
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

    const groupedDaLayerValues = groupBy(daLayerValues, 'daLayer')

    const groupedProjectValues = groupBy(projectValues, 'daLayer')

    const onlyL2sDaLayerValues = Object.fromEntries(
      daLayerIds.map((daLayer) => {
        const projectValues = groupedProjectValues[daLayer] ?? []
        const timestampedValues = groupBy(projectValues, 'timestamp')
        const values = Object.entries(timestampedValues).map(
          ([timestamp, values]) => {
            const totalSize = values.reduce(
              (acc, v) => acc + Number(v.totalSize),
              0,
            )
            return {
              projectId: daLayer,
              timestamp: new UnixTime(Number(timestamp)),
              totalSize,
              daLayer,
            }
          },
        )

        return [daLayer, values]
      }),
    )

    const largestPosters = await getLargestPosters(
      groupedDaLayerValues,
      groupedProjectValues,
    )

    const data = daLayers
      .map((daLayer) => {
        const grDaL = opts?.scalingProjectsOnly
          ? onlyL2sDaLayerValues
          : groupedDaLayerValues
        const lastRecord = grDaL[daLayer.id]?.at(-1)
        if (!lastRecord) {
          return undefined
        }

        const latestThroughput = daLayer.daLayer.throughput
          ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
          .at(-1)

        assert(
          latestThroughput,
          'Project does not have throughput data configured',
        )

        const largestPoster = largestPosters[daLayer.id]
        const pastDayAvgThroughputPerSecond =
          Number(lastRecord.totalSize) / UnixTime.DAY
        const maxThroughputPerSecond = getMaxThroughputPerSecond(
          daLayer.id,
          latestThroughput,
        )
        const pastDayAvgCapacityUtilization = round(
          (pastDayAvgThroughputPerSecond / maxThroughputPerSecond) * 100,
          2,
        )

        return [
          daLayer.id,
          {
            totalSize: Number(lastRecord.totalSize),
            syncedUntil: lastRecord.timestamp.toNumber(),
            pastDayAvgThroughputPerSecond,
            largestPoster: largestPoster
              ? {
                  name: largestPoster.name,
                  percentage: round(
                    (Number(largestPoster.totalSize) /
                      Number(lastRecord.totalSize)) *
                      100,
                    2,
                  ),
                  totalPosted: Number(largestPoster.totalSize),
                }
              : undefined,
            maxThroughputPerSecond,
            pastDayAvgCapacityUtilization,
            totalPosted: Number(lastRecord.totalSize),
          },
        ] as const
      })
      .filter(notUndefined)

    return Object.fromEntries(data)
  },
  ['da-throughput-table-data'],
  { tags: ['hourly-data'], revalidate: 1 },
)

function getMockDaThroughputTableData(
  ...parameters: Parameters<typeof getCachedDaThroughputTableData>
): ThroughputTableData {
  const [daLayerIds] = parameters
  return Object.fromEntries(
    daLayerIds
      .map((daLayerId) => {
        return [
          daLayerId,
          {
            totalSize: 101312,
            syncedUntil:
              daLayerId === 'avail'
                ? UnixTime.now().toStartOf('day').add(-2, 'days').toNumber()
                : UnixTime.now().toStartOf('day').add(-1, 'days').toNumber(),
            pastDayAvgThroughputPerSecond: 1.5,
            maxThroughputPerSecond: 4.3,
            largestPoster: {
              name: 'Base',
              percentage: 12,
              totalPosted: 123123,
            },
            pastDayAvgCapacityUtilization: 24,
            totalPosted: 20312412,
          },
        ] as const
      })
      .filter(notUndefined),
  )
}

function getMaxThroughputPerSecond(
  daLayerId: ProjectId,
  latestThroughput: DaLayerThroughput,
) {
  const isEthereum = daLayerId === ProjectId.ETHEREUM
  const size = isEthereum ? latestThroughput.target! : latestThroughput.size
  assert(size, 'Project does not have throughput data configured')
  return size / latestThroughput.frequency
}

async function getLargestPosters(
  groupedDaLayerValues: Record<string, DataAvailabilityRecord[]>,
  groupedProjectValues: Record<string, DataAvailabilityRecord[]>,
) {
  const largestPosters = Object.fromEntries(
    Object.entries(groupedProjectValues)
      .map(([daLayer, values]) => {
        let largestPoster = undefined
        const lastTimestamp = groupedDaLayerValues[daLayer]?.at(-1)?.timestamp
        if (!lastTimestamp) {
          return undefined
        }

        const filteredValues = values.filter((v) =>
          v.timestamp.equals(lastTimestamp),
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
          ...largestPoster,
        },
      ] as const
    }),
  )
}
