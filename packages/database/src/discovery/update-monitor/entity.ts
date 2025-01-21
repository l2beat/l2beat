import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateMonitor } from '../../kysely/generated/types'

export interface UpdateMonitorRecord {
  projectName: string
  chainId: ChainId
  blockNumber: number
  timestamp: UnixTime | null
  discovery: DiscoveryOutput
  configHash: Hash256
}

export function toRow(record: UpdateMonitorRecord): Insertable<UpdateMonitor> {
  return {
    projectName: record.projectName,
    chainId: +record.chainId,
    blockNumber: record.blockNumber,
    timestamp: record.timestamp ? record.timestamp.toDate() : null,
    discoveryJsonBlob: JSON.stringify(record.discovery),
    configHash: record.configHash.toString(),
  }
}

export function toRecord(row: Selectable<UpdateMonitor>): UpdateMonitorRecord {
  return {
    projectName: row.projectName,
    chainId: ChainId(row.chainId),
    blockNumber: row.blockNumber,
    timestamp: row.timestamp ? UnixTime.fromDate(row.timestamp) : null,
    discovery: row.discoveryJsonBlob as unknown as DiscoveryOutput,
    configHash: Hash256(row.configHash),
  }
}
