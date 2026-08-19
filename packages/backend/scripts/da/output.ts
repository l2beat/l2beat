import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { formatBytes, UnixTime } from '@l2beat/shared-pure'
import * as fs from 'fs'
import type { RecordGap } from './gaps'

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
    let project = byProject.get(record.projectId)
    if (!project) {
      project = new Map()
      byProject.set(record.projectId, project)
    }
    const list = project.get(key)
    if (list) {
      list.push(record)
    } else {
      project.set(key, [record])
    }
  }

  for (const [projectId, configs] of [...byProject.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    for (const [config, configRecords] of configs) {
      const totalSize = configRecords.reduce((acc, r) => acc + r.totalSize, 0n)
      logger.info(projectId, {
        configuration: config,
        hours: configRecords.length,
        totalSize: formatBytes(totalSize, {
          decimals: totalSize < 1024 ? 0 : 2,
        }),
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
