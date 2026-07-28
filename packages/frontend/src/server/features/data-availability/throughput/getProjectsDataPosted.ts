import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import {
  type ChartRange,
  type ChartResolution,
  optionToRange,
  rangeToResolution,
} from '~/utils/range/range'
import {
  groupByTimestampAndDaLayerId,
  sumGroupedDataPosted,
} from './getDaThroughputChart'

export interface ProjectDataPosted {
  pastDay: number
  change: number
  changePeriod: '7D'
}

export type ProjectsDataPosted = Record<string, ProjectDataPosted>

export async function getProjectsDataPosted(
  projectIds: string[],
): Promise<ProjectsDataPosted> {
  if (env.MOCK) {
    return Object.fromEntries(
      projectIds.map((projectId) => [
        projectId,
        {
          pastDay: 100_000_000,
          change: 0.1,
          changePeriod: '7D',
        },
      ]),
    )
  }

  const range = optionToRange('1d')
  const from = range[0]
  if (from === null) {
    return {}
  }

  const records = await getDb().dataAvailability.getByProjectIdsAndTimeRange(
    projectIds,
    [from - 7 * UnixTime.DAY, range[1]],
  )

  return buildProjectsDataPosted(records, from, range[1])
}

export function buildProjectsDataPosted(
  records: DataAvailabilityRecord[],
  from: number,
  to: number,
): ProjectsDataPosted {
  const sevenDaysAgoFrom = from - 7 * UnixTime.DAY
  const sevenDaysAgoTo = to - 7 * UnixTime.DAY
  const resolution = rangeToResolution([from, to])
  const recordsByProject = groupBy(records, (record) => record.projectId)
  const result: ProjectsDataPosted = {}

  for (const [projectId, projectRecords] of Object.entries(recordsByProject)) {
    const pastDay = getTotalDataPosted(projectRecords, [from, to], resolution)
    if (pastDay === 0) continue

    const sevenDaysAgo = getTotalDataPosted(
      projectRecords,
      [sevenDaysAgoFrom, sevenDaysAgoTo],
      resolution,
    )
    result[projectId] = {
      pastDay,
      change: calculatePercentageChange(pastDay, sevenDaysAgo),
      changePeriod: '7D',
    }
  }

  return result
}

function getTotalDataPosted(
  records: DataAvailabilityRecord[],
  range: ChartRange,
  resolution: ChartResolution,
) {
  const [from, to] = range
  const recordsInRange = records.filter(
    (record) =>
      (from === null || record.timestamp >= from) && record.timestamp < to,
  )
  if (recordsInRange.length === 0) return 0

  const { grouped } = groupByTimestampAndDaLayerId(recordsInRange, resolution)
  return sumGroupedDataPosted(grouped)
}
