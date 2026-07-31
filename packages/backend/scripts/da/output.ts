import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import * as fs from 'fs'
import type { RecordGap } from '../../src/modules/data-availability/preview/gaps'

const MAX_LISTED_GAP_HOURS = 6

export function summarizeRecords(
  records: DataAvailabilityRecord[],
  logger: Logger,
): void {
  if (records.length === 0) {
    logger.warn('No records generated for the requested window')
    return
  }

  const byProject = new Map<string, Map<string, DataAvailabilityRecord[]>>()
  for (const record of records) {
    const key = `${record.daLayer} ${record.configurationId}`
    const project = byProject.get(record.projectId) ?? new Map()
    byProject.set(record.projectId, project)
    project.set(key, [...(project.get(key) ?? []), record])
  }

  for (const [projectId, configs] of [...byProject.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    for (const [config, configRecords] of configs) {
      const totalSize = configRecords.reduce((acc, r) => acc + r.totalSize, 0n)
      logger.info(projectId, {
        configuration: config,
        hours: configRecords.length,
        totalSize: formatBytes(totalSize),
      })
    }
  }
}

export function summarizeGaps(gaps: RecordGap[], logger: Logger): void {
  if (gaps.length === 0) {
    logger.info(
      'No coverage gaps - every configuration has records for all expected hours',
    )
    return
  }

  for (const gap of gaps) {
    const listed = gap.missingHours
      .slice(0, MAX_LISTED_GAP_HOURS)
      .map((h) => UnixTime.toDate(h).toISOString())
    const more = gap.missingHours.length - listed.length
    logger.warn(
      `GAP ${gap.projectId} (${gap.daLayer} ${gap.configurationId}): no data in ${gap.missingHours.length}/${gap.expectedHours} hours`,
      { missing: more > 0 ? [...listed, `+${more} more`] : listed },
    )
  }
  logger.warn(
    `${gaps.length} configuration(s) have hours without data - if you are adding a new config, it may not have full coverage (wrong sequencer/topic/namespace?). It can also mean the project simply did not post in those hours.`,
  )
}

export function writePreviewJson(path: string, payload: unknown): void {
  fs.writeFileSync(
    path,
    JSON.stringify(
      payload,
      (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      2,
    ),
  )
}

export function formatBytes(bytes: bigint): string {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  let value = Number(bytes)
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(unit === 0 ? 0 : 2)} ${units[unit]}`
}
