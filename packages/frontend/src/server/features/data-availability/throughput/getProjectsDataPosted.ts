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
} from './utils/groupByTimestampAndDaLayerId'

export interface ProjectDataPosted {
  pastDay: number
  change: number
  changePeriod: '7D'
  /**
   * What the past day's blobs cost at the blob base fee of their blocks, and
   * nothing else the batch transactions paid. Undefined before fees were
   * tracked; USD null when an hour has no ETH price
   */
  paidForBlobs: { eth: number; usd: number | null } | undefined
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
          paidForBlobs: { eth: 0.0123, usd: 42 },
        },
      ]),
    )
  }

  const range = optionToRange('1d')
  const from = range[0]
  if (from === null) {
    return {}
  }
  // Report the full previous UTC day (midnight → midnight) instead of the
  // chart's range end, which trails ~75min behind now and spans 24-47h.
  const to = from + UnixTime.DAY

  const db = getDb()
  const [records, prices] = await Promise.all([
    db.dataAvailability.getByProjectIdsAndTimeRange(projectIds, [
      from - 7 * UnixTime.DAY,
      to,
    ]),
    db.l2CostPrice.getByTimestampRange(from, to),
  ])

  return buildProjectsDataPosted(
    records,
    from,
    to,
    new Map(prices.map((p) => [p.timestamp, p.priceUsd])),
  )
}

export function buildProjectsDataPosted(
  records: DataAvailabilityRecord[],
  from: number,
  to: number,
  /** ETH in USD by hour */
  prices: Map<number, number> = new Map(),
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
      paidForBlobs: getPaidForBlobs(projectRecords, [from, to], prices),
    }
  }

  return result
}

function getPaidForBlobs(
  records: DataAvailabilityRecord[],
  [from, to]: [number, number],
  prices: Map<number, number>,
): ProjectDataPosted['paidForBlobs'] {
  let eth: number | null = null
  let usd: number | null = 0
  for (const record of records) {
    if (record.timestamp < from || record.timestamp >= to) continue
    if (record.totalFeeEth === null) continue
    eth = (eth ?? 0) + record.totalFeeEth
    const price = prices.get(record.timestamp)
    usd =
      usd === null || price === undefined
        ? null
        : usd + record.totalFeeEth * price
  }
  return eth === null ? undefined : { eth, usd }
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
