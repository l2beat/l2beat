import { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { DailyDiscovery as DailyDiscoveryRow } from '../kysely/generated/types'
import { sanitizeDiscoveryOutput } from './sanitizeDiscoveryOutput'

export interface DailyDiscovery {
  projectName: string
  chainId: ChainId
  blockNumber: number
  timestamp: UnixTime
  discovery: DiscoveryOutput
  configHash: Hash256
  version: number
}

export function toRecord(
  entity: Selectable<DailyDiscoveryRow>,
): DailyDiscovery {
  return {
    projectName: entity.project_name,
    chainId: ChainId(entity.chain_id),
    timestamp: UnixTime.fromDate(entity.unix_timestamp),
    blockNumber: entity.block_number,
    version: entity.version,
    configHash: Hash256(entity.config_hash),
    // NOTE(radomski): This has to be here, otherwise the risk of exposing our
    // API keys goes way up. Putting this in the database gives us the highest
    // chance of being secure. We still want to show that there was an error
    // so sanitize it to expose minimal information.
    discovery: sanitizeDiscoveryOutput(
      entity.discovery_json_blob as DiscoveryOutput,
    ),
  }
}

export function toRow(
  dailyDiscovery: DailyDiscovery,
): Insertable<DailyDiscoveryRow> {
  return {
    project_name: dailyDiscovery.projectName,
    chain_id: +dailyDiscovery.chainId,
    unix_timestamp: dailyDiscovery.timestamp.toDate(),
    block_number: dailyDiscovery.blockNumber,
    version: dailyDiscovery.version,
    config_hash: dailyDiscovery.configHash.toString(),
    discovery_json_blob: dailyDiscovery.discovery,
  }
}
