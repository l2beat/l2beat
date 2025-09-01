import type { DiscoveryOutput } from '@l2beat/discovery'
import { Hash256, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateMonitor } from '../../kysely/generated/types'

export interface UpdateMonitorRecord {
  projectId: string
  blockNumber: number
  timestamp: UnixTime | null
  discovery: DiscoveryOutput
  configHash: Hash256
}

export function toRow(record: UpdateMonitorRecord): Insertable<UpdateMonitor> {
  return {
    projectId: record.projectId,
    blockNumber: record.blockNumber,
    timestamp:
      record.timestamp !== null ? UnixTime.toDate(record.timestamp) : null,
    discoveryJsonBlob: JSON.stringify(record.discovery),
    configHash: record.configHash.toString(),
  }
}

export function toRecord(row: Selectable<UpdateMonitor>): UpdateMonitorRecord {
  return {
    projectId: row.projectId,
    blockNumber: row.blockNumber,
    timestamp: row.timestamp ? UnixTime.fromDate(row.timestamp) : null,
    discovery: row.discoveryJsonBlob as unknown as DiscoveryOutput,
    configHash: Hash256(row.configHash),
  }
}
