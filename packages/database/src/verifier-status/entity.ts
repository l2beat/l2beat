import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { VerifierStatus as VerifierStatusRow } from '../kysely/generated/types'

export interface VerifierStatus {
  address: string
  chainId: ChainId
  lastUsed: UnixTime
  lastUpdated: UnixTime
}

export function toRow(record: VerifierStatus): Insertable<VerifierStatusRow> {
  return {
    address: record.address,
    chain_id: +record.chainId,
    last_used: record.lastUsed.toDate(),
    last_updated: record.lastUpdated.toDate(),
  }
}

export function toRecord(row: Selectable<VerifierStatusRow>): VerifierStatus {
  return {
    address: row.address,
    chainId: ChainId(row.chain_id),
    lastUsed: UnixTime.fromDate(row.last_used),
    lastUpdated: UnixTime.fromDate(row.last_updated),
  }
}
