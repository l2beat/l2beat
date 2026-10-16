import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { CropAttestation } from '../kysely/generated/types'

export interface CropAttestationRecord {
  chainId: number
  /** Lowercase. */
  attester: string
  uid: string
  revision: number
  reviewedAt: UnixTime
  projectIds: string[]
  txHash: string
  blockNumber: number
  updatedAt: UnixTime
}

function toRecord(row: Selectable<CropAttestation>): CropAttestationRecord {
  return {
    ...row,
    reviewedAt: UnixTime.fromDate(row.reviewedAt),
    updatedAt: UnixTime.fromDate(row.updatedAt),
  }
}

function toRow(record: CropAttestationRecord): Insertable<CropAttestation> {
  return {
    ...record,
    attester: record.attester.toLowerCase(),
    reviewedAt: UnixTime.toDate(record.reviewedAt),
    updatedAt: UnixTime.toDate(record.updatedAt),
  }
}

/** One row per attester: its current attestation, which the backend replaces as it changes. */
export class CropAttestationRepository extends BaseRepository {
  async find(
    chainId: number,
    attester: string,
  ): Promise<CropAttestationRecord | undefined> {
    const row = await this.db
      .selectFrom('CropAttestation')
      .selectAll()
      .where('chainId', '=', chainId)
      .where('attester', '=', attester.toLowerCase())
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async upsert(record: CropAttestationRecord): Promise<void> {
    await this.db
      .insertInto('CropAttestation')
      .values(toRow(record))
      .onConflict((oc) =>
        oc.columns(['chainId', 'attester']).doUpdateSet((eb) => ({
          uid: eb.ref('excluded.uid'),
          revision: eb.ref('excluded.revision'),
          reviewedAt: eb.ref('excluded.reviewedAt'),
          projectIds: eb.ref('excluded.projectIds'),
          txHash: eb.ref('excluded.txHash'),
          blockNumber: eb.ref('excluded.blockNumber'),
          updatedAt: eb.ref('excluded.updatedAt'),
        })),
      )
      .execute()
  }

  async delete(chainId: number, attester: string): Promise<number> {
    const result = await this.db
      .deleteFrom('CropAttestation')
      .where('chainId', '=', chainId)
      .where('attester', '=', attester.toLowerCase())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('CropAttestation')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
