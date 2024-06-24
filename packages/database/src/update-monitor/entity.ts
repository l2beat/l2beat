import { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { UpdateMonitor as UpdateMonitorRow } from '../kysely/generated/types'

export interface UpdateMonitor {
  projectName: string
  chainId: ChainId
  blockNumber: number
  timestamp: UnixTime | null
  discovery: DiscoveryOutput
  configHash: Hash256
  version: number
}

export function toRow(record: UpdateMonitor): Insertable<UpdateMonitorRow> {
  return {
    project_name: record.projectName,
    chain_id: +record.chainId,
    block_number: record.blockNumber,
    unix_timestamp: record.timestamp ? record.timestamp.toDate() : null,
    discovery_json_blob: JSON.stringify(record.discovery),
    config_hash: record.configHash.toString(),
    version: record.version,
  }
}

export function toRecord(row: Selectable<UpdateMonitorRow>): UpdateMonitor {
  return {
    projectName: row.project_name,
    chainId: ChainId(row.chain_id),
    blockNumber: row.block_number,
    timestamp: row.unix_timestamp
      ? UnixTime.fromDate(row.unix_timestamp)
      : null,
    discovery: row.discovery_json_blob as unknown as DiscoveryOutput,
    configHash: Hash256(row.config_hash),
    version: row.version,
  }
}
