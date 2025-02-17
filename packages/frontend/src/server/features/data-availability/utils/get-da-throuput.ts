import type { Project } from '@l2beat/config'
import { assert, UnixTime, notUndefined } from '@l2beat/shared-pure'
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
  projects: Project<'daLayer' | 'statuses'>[],
  projectsWithDaTracking: Project<'daTrackingConfig'>[],
) {
  const db = getDb()

  const lastDay = UnixTime.now().toStartOf('day').add(-1, 'days')
  const values = await db.dataAvailability.getByProjectIdsAndTimeRange(
    projects.map((p) => p.id),
    [lastDay.add(-7, 'days'), lastDay],
  )
  const grouped = groupBy(values, 'projectId')

  const data = await Promise.all(
    projects.map(async (project) => {
      const lastRecord = grouped[project.id]?.at(-1)
      if (!lastRecord) {
        return undefined
      }

      const latestThroughput = project.daLayer.throughput
        ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
        .at(-1)

      assert(
        latestThroughput,
        'Project does not have throughput data configured',
      )

      const projectsUsingDa = projectsWithDaTracking.filter(
        (p) => project.daLayer.name === p.daTrackingConfig.daLayer,
      )
      const largestPosterRecord =
        projectsUsingDa.length > 0
          ? await db.dataAvailability.getLargestPosterByProjectIdsAndTimestamp(
              projectsUsingDa.map((p) => p.id),
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

      const pastDayAvgThroughput = getThroughput(
        Number(lastRecord.totalSize) / 1000, // Convert to KB
        86_400,
      )
      const maxThroughput = getThroughput(
        latestThroughput.size,
        latestThroughput.frequency,
      )

      const pastDayAvgCapacityUtilization =
        Math.round((pastDayAvgThroughput / maxThroughput) * 100 * 100) / 100

      return [
        project.id,
        {
          totalSize: lastRecord.totalSize,
          syncedUntil: lastRecord.timestamp,
          pastDayAvgThroughput,
          largestPoster,
          maxThroughput,
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
            pastDayAvgThroughput: 1.5,
            maxThroughput: 4.3,
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

function getThroughput(bytes: number, frequencySeconds: number): number {
  if (bytes === 0) {
    return 0
  }

  if (frequencySeconds === 0) {
    throw new Error('Frequency cannot be zero.')
  }

  const mb = bytes / 1_000
  const throughput = mb / frequencySeconds

  // Round to at most 4 digits
  const numDigitsBeforeDecimal = Math.floor(Math.log10(throughput)) + 1
  const decimalPlaces = Math.max(0, 3 - numDigitsBeforeDecimal)
  const formattedThroughput = Number(throughput.toFixed(decimalPlaces))

  return formattedThroughput
}
