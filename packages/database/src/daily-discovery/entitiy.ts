import { Insertable, Selectable } from 'kysely'
import { DailyDiscovery as DailyDiscoveryRow } from '../kysely/generated/types'

export interface DailyDiscovery {
  projectName: string
  chainId: number
  unixTimestamp: Date
  blockNumber: number
  version: number
  configHash: string
  discoveryJsonBlob: any
}

export function toRecord(
  entity: Selectable<DailyDiscoveryRow>,
): DailyDiscovery {
  return {
    projectName: entity.project_name,
    chainId: entity.chain_id,
    unixTimestamp: entity.unix_timestamp,
    blockNumber: entity.block_number,
    version: entity.version,
    configHash: entity.config_hash,
    discoveryJsonBlob: entity.discovery_json_blob,
  }
}

export function toRow(
  dailyDiscovery: DailyDiscovery,
): Insertable<DailyDiscoveryRow> {
  return {
    project_name: dailyDiscovery.projectName,
    chain_id: dailyDiscovery.chainId,
    unix_timestamp: dailyDiscovery.unixTimestamp,
    block_number: dailyDiscovery.blockNumber,
    version: dailyDiscovery.version,
    config_hash: dailyDiscovery.configHash,
    discovery_json_blob: dailyDiscovery.discoveryJsonBlob,
  }
}
