import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import * as fs from 'fs'

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
