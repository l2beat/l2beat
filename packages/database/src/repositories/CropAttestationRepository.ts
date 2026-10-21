import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { CropAttestation } from '../kysely/generated/types'

export interface CropAttestationRecord {
  /** Hash of the source the attestation was read from. */
  configId: string
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
 * The current attestation of the backend's attestation source, with the source
 * it was read from, so readers need no config of their own. The backend keeps
 * only its current source's row, and replaces it as it changes.
 */
export class CropAttestationRepository extends BaseRepository {
  /** Newest first, in case a previous source's row is not removed yet. */
  async findCurrent(): Promise<CropAttestationRecord | undefined> {
    const row = await this.db
      .selectFrom('CropAttestation')
      .selectAll()
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async upsert(record: CropAttestationRecord): Promise<void> {
    await this.db
      .insertInto('CropAttestation')
      .values(toRow(record))
      .onConflict((oc) =>
        oc.column('configId').doUpdateSet((eb) => ({
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

  async delete(configId: string): Promise<number> {
    const result = await this.db
      .deleteFrom('CropAttestation')
      .where('configId', '=', configId)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  /** Removes the rows of every other source, left behind when the source changes. */
  async deleteAllExcept(configId: string): Promise<number> {
    const result = await this.db
      .deleteFrom('CropAttestation')
      .where('configId', '!=', configId)
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
