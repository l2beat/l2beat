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
    ...record,
    chainId: +record.chainId,
    unixTimestamp: record.timestamp ? record.timestamp.toDate() : null,
    discoveryJsonBlob: JSON.stringify(record.discovery),
    configHash: record.configHash.toString(),
  }
}

export function toRecord(row: Selectable<UpdateMonitor>): UpdateMonitorRecord {
  return {
    ...row,
    chainId: ChainId(row.chainId),
    timestamp: row.unixTimestamp ? UnixTime.fromDate(row.unixTimestamp) : null,
    discovery: row.discoveryJsonBlob as unknown as DiscoveryOutput,
    configHash: Hash256(row.configHash),
  }
}
