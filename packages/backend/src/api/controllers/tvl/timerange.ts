import { ProjectId, Token, UnixTime } from '@l2beat/shared-pure'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getSixHourlyMinTimestamp } from '../utils/getSixHourlyMinTimestamp'

export {
  fillAllMissingAggregatedReports,
  fillAllMissingAssetReports,
  timeRange,
}

type TimeResolution = 'hourly' | 'sixHourly' | 'daily'

function resolutionToStep(resolution: TimeResolution) {
  const step =
    resolution === 'hourly'
      ? UnixTime.HOUR
      : resolution === 'sixHourly'
      ? UnixTime.HOUR * 6
      : UnixTime.DAY

  return function (old: UnixTime) {
    return old.add(step, 'seconds')
  }
}

/**
 * Create range of `UnixTime` timestamps of given resolution between given timestamps
 */
function timeRange(from: UnixTime, to: UnixTime, resolution: TimeResolution) {
  const result: UnixTime[] = []
  let current = from
  const step = resolutionToStep(resolution)
  while (current.lt(to)) {
    result.push(current)

    current = step(current)
  }
  return result
}

/**
 * Extract missing timestamps from data-in-time between `from` and `to` time boundaries
 */
function getMissingTimestamps<T extends { timestamp: UnixTime }>(
  data: T[],
  from: UnixTime,
  to: UnixTime,
  resolution: TimeResolution,
) {
  const knownTimestamps = new Set(data.map((d) => d.timestamp.toNumber()))

  const range =
    // Since we want to start offset range from full hour in case of six-hourly resolution
    // It does not matter in case of hourly and daily resolutions
    resolution === 'sixHourly'
      ? timeRange(from.toStartOf('day'), to, resolution)
      : timeRange(from, to, resolution)

  return range.filter((timestamp) => !knownTimestamps.has(timestamp.toNumber()))
}

/**
 * Fill missing data-in-time using placeholder data
 */
function fillMissingTimestampsWith<T extends { timestamp: UnixTime }>(
  data: T[],
  fill: (timestamp: UnixTime) => T,
  from: UnixTime,
  to: UnixTime,
  resolution: TimeResolution,
) {
  const missingTimestamps = getMissingTimestamps(data, from, to, resolution)

  const missingData = missingTimestamps.map(fill)

  return [...data, ...missingData].sort(
    (a, b) => a.timestamp.toNumber() - b.timestamp.toNumber(),
  )
}

/**
 * For each dot product of project IDs and bucket types, fill missing reports with zeros
 * to match chart offsets and frontend time range needs
 */
function fillAllMissingAggregatedReports(
  projectIds: ProjectId[],
  reports: {
    hourly: AggregatedReportRecord[]
    sixHourly: AggregatedReportRecord[]
    daily: AggregatedReportRecord[]
  },
  latestTimestamp: UnixTime,
) {
  const buckets = ['TVL', 'CBV', 'EBV', 'NMV'] as const

  // Helper to fill reports for bucket x project - narrowed data boundaries
  function fill(
    reports: AggregatedReportRecord[],
    from: UnixTime,
    to: UnixTime,
    resolution: TimeResolution,
  ) {
    return projectIds.flatMap((projectId) =>
      buckets.flatMap((bucket) =>
        fillMissingTimestampsWith(
          reports.filter(
            (r) => r.reportType === bucket && r.projectId === projectId,
          ),
          (timestamp) => ({
            timestamp,
            projectId,
            reportType: bucket,
            usdValue: 0n,
            ethValue: 0n,
          }),
          from,
          to,
          resolution,
        ),
      ),
    )
  }

  return {
    filledHourlyReports: fill(
      reports.hourly,
      getHourlyMinTimestamp(latestTimestamp),
      latestTimestamp,
      'hourly',
    ),
    filledSixHourlyReports: fill(
      reports.sixHourly,
      getSixHourlyMinTimestamp(latestTimestamp),
      latestTimestamp,
      'sixHourly',
    ),
    filledDailyReports: fill(
      reports.daily,
      UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')), // Ethereum genesis
      latestTimestamp,
      'daily',
    ),
  }
}

/**
 * For each dot product of project IDs and bucket types, fill missing reports with zeros
 * to match chart offsets and frontend time range needs
 */
function fillAllMissingAssetReports(
  asset: Token,
  projectId: ProjectId,
  reports: {
    hourly: ReportRecord[]
    sixHourly: ReportRecord[]
    daily: ReportRecord[]
  },
  latestTimestamp: UnixTime,
) {
  const fillFn = (timestamp: UnixTime) => ({
    timestamp,
    projectId,
    asset: asset.id,
    chainId: asset.chainId,
    reportType: asset.type,
    amount: 0n,
    usdValue: 0n,
    ethValue: 0n,
  })

  const filledHourlyReports = fillMissingTimestampsWith(
    reports.hourly,
    fillFn,
    getHourlyMinTimestamp(latestTimestamp),
    latestTimestamp,
    'hourly',
  )

  const filledSixHourlyReports = fillMissingTimestampsWith(
    reports.sixHourly,
    fillFn,
    getSixHourlyMinTimestamp(latestTimestamp),
    latestTimestamp,
    'sixHourly',
  )

  const filledDailyReports = fillMissingTimestampsWith(
    reports.daily,
    fillFn,
    UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')), // Ethereum genesis
    latestTimestamp,
    'daily',
  )

  return {
    filledHourlyReports,
    filledSixHourlyReports,
    filledDailyReports,
  }
}
