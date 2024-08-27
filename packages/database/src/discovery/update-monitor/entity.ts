import { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { UpdateMonitor } from '../../kysely/generated/types'

export interface UpdateMonitorRecord {
  projectName: string
  chainId: ChainId
  blockNumber: number
  timestamp: UnixTime | null
  discovery: DiscoveryOutput
  configHash: Hash256
  version: number
}

export function toRow(record: UpdateMonitorRecord): Insertable<UpdateMonitor> {
  return {
    projectName: record.projectName,
    chainId: +record.chainId,
    blockNumber: record.blockNumber,
    timestamp: record.timestamp ? record.timestamp.toDate() : null,
    discoveryJsonBlob: JSON.stringify(record.discovery),
    configHash: record.configHash.toString(),
    version: record.version,
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
    version: row.version,
  }
}
