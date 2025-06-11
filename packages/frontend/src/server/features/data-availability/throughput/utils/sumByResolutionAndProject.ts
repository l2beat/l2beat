import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

/** This function sums up totalSize for each day and project */
export function sumByResolutionAndProject(
  records: DataAvailabilityRecord[],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  const groupedByProjectId = groupBy(records, (r) => r.projectId)
  const result: Omit<DataAvailabilityRecord, 'configurationId'>[] = []

  for (const [projectId, projectRecords] of Object.entries(
    groupedByProjectId,
  )) {
    const groupedByDay = groupBy(projectRecords, (r) =>
      UnixTime.toStartOf(
        r.timestamp,
        resolution === 'hourly'
          ? 'hour'
          : resolution === 'sixHourly'
            ? 'six hours'
            : 'day',
      ),
    )
    const daLayer = projectRecords[0]?.daLayer
    assert(daLayer, 'DaLayer not found')
    for (const [day, dayRecords] of Object.entries(groupedByDay)) {
      const totalSize = dayRecords.reduce((acc, r) => acc + r.totalSize, 0n)
      result.push({
        projectId,
        timestamp: Number(day),
        totalSize,
        daLayer,
      })
    }
  }
  return result
}
