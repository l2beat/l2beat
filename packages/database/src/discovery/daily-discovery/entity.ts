import { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { DailyDiscovery } from '../../kysely/generated/types'
import { sanitizeDiscoveryOutput } from './sanitizeDiscoveryOutput'

export interface DailyDiscoveryRecord {
  projectName: string
  chainId: ChainId
  blockNumber: number
  timestamp: UnixTime
  discovery: DiscoveryOutput
  configHash: Hash256
  version: number
}

export function toRecord(
  entity: Selectable<DailyDiscovery>,
): DailyDiscoveryRecord {
  return {
    ...entity,
    chainId: ChainId(entity.chainId),
    timestamp: UnixTime.fromDate(entity.unixTimestamp),
    configHash: Hash256(entity.configHash),
    // NOTE(radomski): This has to be here, otherwise the risk of exposing our
    // API keys goes way up. Putting this in the database gives us the highest
    // chance of being secure. We still want to show that there was an error
    // so sanitize it to expose minimal information.
    discovery: sanitizeDiscoveryOutput(
      entity.discoveryJsonBlob as DiscoveryOutput,
    ),
  }
}

export function toRow(
  dailyDiscovery: DailyDiscoveryRecord,
): Insertable<DailyDiscovery> {
  return {
    ...dailyDiscovery,
    chainId: +dailyDiscovery.chainId,
    unixTimestamp: dailyDiscovery.timestamp.toDate(),
    configHash: dailyDiscovery.configHash.toString(),
  }
}
