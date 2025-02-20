import type { DaLayerThroughput, Project } from '@l2beat/config'
import { assert, ProjectId, UnixTime, notUndefined } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaThroughputTable(
  projects: Project<'daLayer' | 'statuses'>[],
  projectsWithDaTracking: Project<'daTrackingConfig'>[],
) {
  if (env.MOCK) {
    return getMockDaThroughputTableData(projects)
  }
  return getCachedDaThroughputTableData(projects, projectsWithDaTracking)
}

export type ThroughputTableData = Awaited<
  ReturnType<typeof getCachedDaThroughputTableData>
>
const getCachedDaThroughputTableData = cache(
  async (
    daLayers: Project<'daLayer' | 'statuses'>[],
    projectsWithDaTracking: Project<'daTrackingConfig'>[],
  ) => {
    const db = getDb()

    const lastDay = UnixTime.now().toStartOf('day').add(-1, 'days')
    const values = await db.dataAvailability.getByProjectIdsAndTimeRange(
      daLayers.map((p) => p.id),
      [lastDay.add(-7, 'days'), lastDay],
    )
    const grouped = groupBy(values, 'projectId')

    const data = await Promise.all(
      daLayers.map(async (daLayer) => {
        const lastRecord = grouped[daLayer.id]?.at(-1)
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

        const projectsUsingThisDa = projectsWithDaTracking.filter((p) => {
          const projectLayers = p.daTrackingConfig.map((p) => p.daLayer)
          return projectLayers.some((p) => p === daLayer.id)
        })

        const largestPosterRecord =
          projectsUsingThisDa.length > 0
            ? await db.dataAvailability.getLargestPosterByProjectIdsAndTimestamp(
                projectsUsingThisDa.map((p) => p.id),
                lastRecord.timestamp,
              )
            : undefined
        const largestPoster = largestPosterRecord
          ? {
              name:
                projectsWithDaTracking.find(
                  (p) => p.id === largestPosterRecord.projectId,
                )?.name ?? '',
              percentage:
                Math.round(
                  (Number(largestPosterRecord.totalSize) /
                    Number(lastRecord.totalSize)) *
                    100 *
                    100,
                ) / 100,
              totalPosted: Number(largestPosterRecord.totalSize),
            }
          : undefined

        const pastDayAvgThroughputPerSecond =
          Number(lastRecord.totalSize) / UnixTime.DAY
        const maxThroughputPerSecond = getMaxThroughputPerSecond(
          daLayer,
          latestThroughput,
        )

        const pastDayAvgCapacityUtilization =
          Math.round(
            (pastDayAvgThroughputPerSecond / maxThroughputPerSecond) *
              100 *
              100,
          ) / 100
        return [
          daLayer.id,
          {
            totalSize: Number(lastRecord.totalSize),
            syncedUntil: lastRecord.timestamp.toNumber(),
            pastDayAvgThroughputPerSecond,
            largestPoster,
            maxThroughputPerSecond,
            pastDayAvgCapacityUtilization,
            totalPosted: Number(lastRecord.totalSize),
          },
        ] as const
      }),
    )

    return Object.fromEntries(data.filter(notUndefined))
  },
  ['da-throughput-table-data'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function getMockDaThroughputTableData(
  projects: Project<'daLayer' | 'statuses'>[],
): ThroughputTableData {
  return Object.fromEntries(
    projects
      .map((project) => {
        return [
          project.id,
          {
            totalSize: 101312,
            syncedUntil:
              project.id === 'avail'
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
  daLayer: Project<'daLayer' | 'statuses'>,
  latestThroughput: DaLayerThroughput,
) {
  const isEthereum = daLayer.id === ProjectId.ETHEREUM
  const size = isEthereum ? latestThroughput.target! : latestThroughput.size
  assert(size, 'Project does not have throughput data configured')
  return size / latestThroughput.frequency
}
