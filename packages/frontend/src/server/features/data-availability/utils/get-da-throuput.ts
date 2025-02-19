import type { DaLayerThroughput, Project } from '@l2beat/config'
import { assert, ProjectId, UnixTime, notUndefined } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaThroughput(
  projects: Project<'daLayer' | 'statuses'>[],
  projectsWithDaTracking: Project<'daTrackingConfig'>[],
) {
  if (env.MOCK) {
    return getMockThroughputData(projects)
  }
  return getThroughputData(projects, projectsWithDaTracking)
}

export type ThroughputData = Awaited<ReturnType<typeof getThroughputData>>
async function getThroughputData(
  daLayers: Project<'daLayer' | 'statuses'>[],
  projectsWithDaTracking: Project<'daTrackingConfig'>[],
) {
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
            totalPosted: largestPosterRecord.totalSize,
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
          (pastDayAvgThroughputPerSecond / maxThroughputPerSecond) * 100 * 100,
        ) / 100

      return [
        daLayer.id,
        {
          totalSize: lastRecord.totalSize,
          syncedUntil: lastRecord.timestamp,
          pastDayAvgThroughputPerSecond,
          largestPoster,
          maxThroughputPerSecond,
          pastDayAvgCapacityUtilization,
          totalPosted: lastRecord.totalSize,
        },
      ] as const
    }),
  )

  return Object.fromEntries(data.filter(notUndefined))
}

function getMockThroughputData(
  projects: Project<'daLayer' | 'statuses'>[],
): ThroughputData {
  return Object.fromEntries(
    projects
      .map((project) => {
        return [
          project.id,
          {
            totalSize: 101312n,
            syncedUntil:
              project.id === 'avail'
                ? UnixTime.now().toStartOf('day').add(-2, 'days')
                : UnixTime.now().toStartOf('day').add(-1, 'days'),
            pastDayAvgThroughputPerSecond: 1.5,
            maxThroughputPerSecond: 4.3,
            largestPoster: {
              name: 'Base',
              percentage: 12,
              totalPosted: 123123n,
            },
            pastDayAvgCapacityUtilization: 24,
            totalPosted: 20312412n,
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
  const size = isEthereum ? latestThroughput.target : latestThroughput.size
  assert(size, 'Project does not have throughput data configured')
  return size / latestThroughput.frequency
}
