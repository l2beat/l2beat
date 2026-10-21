import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { CropAttestation } from '../kysely/generated/types'

export interface CropAttestationRecord {
  network: string
  chainId: number
  /** EAS contract address. */
  eas: string
  /** easscan host, no trailing slash. */
  explorer: string
  schemaUid: string
  schema: string
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
    reviewedAt: UnixTime.toDate(record.reviewedAt),
    updatedAt: UnixTime.toDate(record.updatedAt),
  }
}

/**
 * The current attestation, with the source it was read from, so readers need
 * no config of their own. Holds at most one row: the backend replaces it.
 */
export class CropAttestationRepository extends BaseRepository {
  async find(): Promise<CropAttestationRecord | undefined> {
    const row = await this.db
      .selectFrom('CropAttestation')
      .selectAll()
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  /** Replaces whatever is stored, whichever source it came from. */
  async replace(record: CropAttestationRecord): Promise<void> {
    await this.transaction(async () => {
      // Two writers at once would each delete nothing and insert their own row.
      // Readers take a weaker lock, so they still see the old row meanwhile.
      await sql`LOCK TABLE "CropAttestation" IN EXCLUSIVE MODE`.execute(this.db)
      await this.db.deleteFrom('CropAttestation').execute()
      await this.db
        .insertInto('CropAttestation')
        .values(toRow(record))
        .execute()
    })
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('CropAttestation')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
