import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { VerifierStatus } from '../../kysely/generated/types'

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
    address: record.address,
    chain_id: +record.chainId,
    last_used: record.lastUsed.toDate(),
    last_updated: record.lastUpdated.toDate(),
  }
}

export function toRecord(
  row: Selectable<VerifierStatus>,
): VerifierStatusRecord {
  return {
    address: row.address,
    chainId: ChainId(row.chain_id),
    lastUsed: UnixTime.fromDate(row.last_used),
    lastUpdated: UnixTime.fromDate(row.last_updated),
  }
}
