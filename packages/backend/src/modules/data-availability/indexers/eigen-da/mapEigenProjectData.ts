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
    if (!configuration) {
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
