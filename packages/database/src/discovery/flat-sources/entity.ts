import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { FlatSources } from '../../kysely/generated/types'

export interface FlatSourcesRecord {
  projectId: string
  chainId: ChainId
  timestamp: number
  contentHash: Hash256
  flat: Record<string, string>
}

export function toRow(
  record: Omit<FlatSourcesRecord, 'flat'>,
  flat?: FlatSourcesRecord['flat'],
): Insertable<FlatSources> {
  const result = {
    projectId: record.projectId,
    chainId: +record.chainId,
    timestamp: UnixTime.toDate(record.timestamp),
    contentHash: record.contentHash.toString(),
  }
  return flat === undefined ? result : { ...result, flat }
}

export function toRecord(row: Selectable<FlatSources>): FlatSourcesRecord {
  return {
    projectId: row.projectId,
    chainId: ChainId(row.chainId),
    timestamp: UnixTime.fromDate(row.timestamp),
    contentHash: Hash256(row.contentHash),
    flat: row.flat as Record<string, string>,
  }
}
