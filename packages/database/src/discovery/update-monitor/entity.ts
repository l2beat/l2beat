import type { DiscoveryOutput } from '@l2beat/discovery'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateMonitor } from '../../kysely/generated/types'

export interface UpdateMonitorRecord {
  projectId: string
  chainId: ChainId
  timestamp: UnixTime | null
  discovery: DiscoveryOutput
  configHash: Hash256
}

export function toRow(record: UpdateMonitorRecord): Insertable<UpdateMonitor> {
  return {
    projectId: record.projectId,
    chainId: +record.chainId,
    timestamp:
      record.timestamp !== null ? UnixTime.toDate(record.timestamp) : null,
    discoveryJsonBlob: JSON.stringify(record.discovery),
    configHash: record.configHash.toString(),
  }
}

export function toRecord(row: Selectable<UpdateMonitor>): UpdateMonitorRecord {
  return {
    projectId: row.projectId,
    chainId: ChainId(row.chainId),
    timestamp: row.timestamp ? UnixTime.fromDate(row.timestamp) : null,
    discovery: row.discoveryJsonBlob as unknown as DiscoveryOutput,
    configHash: Hash256(row.configHash),
  }
}
