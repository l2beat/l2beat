import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { TimestampDaIndexedConfig } from '../../../../config/Config'

export interface EigenProjectDataEntry {
  datetime: UnixTime
  customer_id: string
  total_size_mb: number
}

export interface EigenDaProjectConfiguration {
  id: string
  minHeight: number
  maxHeight: number | null
  properties: Extract<TimestampDaIndexedConfig, { type: 'eigen-da' }>
}

export function mapEigenProjectData(
  data: EigenProjectDataEntry[],
  configurations: EigenDaProjectConfiguration[],
  daLayer: string,
  startOfTheDay: UnixTime,
): DataAvailabilityRecord[] {
  const recordsMap = new Map<string, DataAvailabilityRecord>()

  for (const d of data) {
    if (
      d.datetime < startOfTheDay - UnixTime.DAY ||
      d.datetime >= startOfTheDay
    ) {
      continue
    }

    const configuration = configurations.find(
      (c) => c.properties.customerId === d.customer_id,
    )
    if (!configuration || !isInsideRange(d.datetime, configuration)) {
      continue
    }
    const key = `${d.datetime}-${configuration.id}`

    const totalSize = BigInt(Math.round(d.total_size_mb * 1024 * 1024))

    const existing = recordsMap.get(key)
    if (!existing) {
      recordsMap.set(key, {
        timestamp: d.datetime,
        totalSize,
        projectId: configuration.properties.projectId,
        daLayer,
        configurationId: configuration.id,
      })
    } else {
      existing.totalSize += totalSize
    }
  }

  return Array.from(recordsMap.values())
}

// The API reports every customer regardless of our ranges. Keep only the hourly
// buckets inside the configuration's range, cut at full hours the same way
// trimData cuts them, so later updates never recreate trimmed rows.
function isInsideRange(
  timestamp: UnixTime,
  configuration: EigenDaProjectConfiguration,
): boolean {
  return (
    timestamp >= UnixTime.toStartOf(configuration.minHeight, 'hour') &&
    (configuration.maxHeight === null ||
      timestamp < UnixTime.toStartOf(configuration.maxHeight + 1, 'hour'))
  )
}
