import { ChainId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { VerifierStatus } from '../../kysely/generated/types'

export interface VerifierStatusRecord {
  address: string
  chainId: ChainId
  lastUsed: UnixTime
  lastUpdated: UnixTime
}

export function toRow(
  record: VerifierStatusRecord,
): Insertable<VerifierStatus> {
  return {
    ...record,
    chainId: +record.chainId,
    lastUsed: record.lastUsed.toDate(),
    lastUpdated: record.lastUpdated.toDate(),
  }
}

export function toRecord(
  row: Selectable<VerifierStatus>,
): VerifierStatusRecord {
  return {
    ...row,
    chainId: ChainId(row.chainId),
    lastUsed: UnixTime.fromDate(row.lastUsed),
    lastUpdated: UnixTime.fromDate(row.lastUpdated),
  }
}
