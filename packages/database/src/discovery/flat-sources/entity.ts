import { ChainId, Hash256 } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { FlatSources } from '../../kysely/generated/types'

export interface FlatSourcesRecord {
  projectName: string
  chainId: ChainId
  blockNumber: number
  contentHash: Hash256
  flat: Record<string, string>
}

export function toRow(record: FlatSourcesRecord): Insertable<FlatSources> {
  return {
    projectName: record.projectName,
    chainId: +record.chainId,
    blockNumber: record.blockNumber,
    contentHash: record.contentHash.toString(),
    flat: JSON.stringify(record.flat),
  }
}

export function toRecord(row: Selectable<FlatSources>): FlatSourcesRecord {
  return {
    projectName: row.projectName,
    chainId: ChainId(row.chainId),
    blockNumber: row.blockNumber,
    contentHash: Hash256(row.contentHash),
    flat: row.flat as Record<string, string>,
  }
}
