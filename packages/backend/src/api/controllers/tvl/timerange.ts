import { AggregatedReportType, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'

type TimeResolution = 'hourly' | 'sixHourly' | 'daily'

export {
  fillAllMissingAggregatedReports,
  fillMissingAggregatedReports,
  timeRange,
}

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

function fillMissingAggregatedReports(
  projectId: ProjectId,
  reports: AggregatedReportRecord[],
  from: UnixTime,
  to: UnixTime,
  resolution: TimeResolution,
  reportType: AggregatedReportType = 'TVL',
) {
  const knownTimestamps = new Set(reports.map((r) => r.timestamp.toNumber()))

  const range =
    // Since we want to start offset range from full hour in case of six-hourly resolution
    // It does not matter in case of hourly and daily resolutions
    resolution === 'sixHourly'
      ? timeRange(from.toStartOf('day'), to, resolution)
      : timeRange(from, to, resolution)

  const result: AggregatedReportRecord[] = []

  for (const timestamp of range) {
    if (!knownTimestamps.has(timestamp.toNumber())) {
      result.push({
        reportType,
        projectId,
        timestamp,
        usdValue: 0n,
        ethValue: 0n,
      })
    }
  }

  return [...reports, ...result].sort(
    (a, b) => a.timestamp.toNumber() - b.timestamp.toNumber(),
  )
}

function fillAllMissingAggregatedReports(
  projectId: ProjectId,
  reports: AggregatedReportRecord[],
  from: UnixTime,
  to: UnixTime,
  resolution: TimeResolution,
  reportType: AggregatedReportType = 'TVL',
) {
  const tvl = reports.filter(
    (r) => r.reportType === reportType && r.projectId === projectId,
  )

  const cbv = reports.filter(
    (r) => r.reportType === 'CBV' && r.projectId === projectId,
  )

  const ebv = reports.filter(
    (r) => r.reportType === 'EBV' && r.projectId === projectId,
  )

  const nmv = reports.filter(
    (r) => r.reportType === 'NMV' && r.projectId === projectId,
  )

  return [
    ...fillMissingAggregatedReports(
      projectId,
      tvl,
      from,
      to,
      resolution,
      reportType,
    ),
    ...fillMissingAggregatedReports(
      projectId,
      cbv,
      from,
      to,
      resolution,
      reportType,
    ),
    ...fillMissingAggregatedReports(
      projectId,
      ebv,
      from,
      to,
      resolution,
      reportType,
    ),
    ...fillMissingAggregatedReports(
      projectId,
      nmv,
      from,
      to,
      resolution,
      reportType,
    ),
  ]
}
