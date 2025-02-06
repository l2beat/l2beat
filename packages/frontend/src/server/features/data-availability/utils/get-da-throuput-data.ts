import type { Project } from '@l2beat/config'
import { assert, UnixTime, notUndefined } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { getDb } from '~/server/database'

export type ThroughputData = Awaited<ReturnType<typeof getDaThroughputData>>

export async function getDaThroughputData(
  projects: Project<'daLayer' | 'statuses'>[],
) {
  const db = getDb()

  const lastDay = UnixTime.now().toStartOf('day').add(-1, 'days')
  const values = await db.dataAvailability.getByProjectIdsAndTimeRange(
    projects.map((p) => p.id),
    [lastDay.add(-7, 'days'), lastDay],
  )
  const grouped = groupBy(values, 'projectId')

  return Object.fromEntries(
    projects
      .map((project) => {
        const lastRecord = grouped[project.id]?.at(-1)
        if (!lastRecord) {
          return undefined
        }

        assert(
          project.daLayer.throughput,
          'Project does not have throughput data',
        )

        const pastDayAvgThroughput = getThroughput(
          Number(lastRecord.totalSize) / 1000, // Convert to KB
          86_400,
        )
        const maxThroughput = getThroughput(
          project.daLayer.throughput.size,
          project.daLayer.throughput.frequency,
        )

        const pastDayAvgCapacityUtilization =
          Math.round((pastDayAvgThroughput / maxThroughput) * 100 * 100) / 100

        return [
          project.id,
          {
            totalSize: lastRecord.totalSize,
            syncedUntil: lastRecord.timestamp,
            pastDayAvgThroughput,
            maxThroughput,
            pastDayAvgCapacityUtilization,
            totalPosted: Number(lastRecord.totalSize) / 1_000_000,
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
