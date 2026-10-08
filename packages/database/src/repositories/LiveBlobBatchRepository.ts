import { ProjectId } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LiveBlobBatch } from '../kysely/generated/types'

/** One blob transaction of a block in LiveBlock */
export interface LiveBlobBatchRecord {
  slot: number
  /** Position of the transaction in its block */
  txIndex: number
  txHash: string
  blockNumber: number
  from: string
  to: string
  blobs: number
  /** Of every event the transaction emitted */
  topics: string[]
  /** Missing when no project claims the batch */
  projectId: ProjectId | undefined
}

/** What a project posted since some slot; without `projectId`, the batches no project claims */
export interface LivePostedRecord {
  projectId: ProjectId | undefined
  blobs: number
  batches: number
  lastSlot: number
  /** Blobs of every batch the project had in `lastSlot` */
  lastBlobs: number
}

/** A project's blobs over the `bucket`-th run of `bucketSlots` slots from genesis */
export interface LiveBucketRecord {
  projectId: ProjectId | undefined
  bucket: number
  blobs: number
}

export function toRecord(row: Selectable<LiveBlobBatch>): LiveBlobBatchRecord {
  return { ...row, projectId: toProjectId(row.projectId) }
}

export function toRow(record: LiveBlobBatchRecord): Insertable<LiveBlobBatch> {
  return { ...record, projectId: record.projectId ?? null }
}

export class LiveBlobBatchRepository extends BaseRepository {
  async upsertMany(records: LiveBlobBatchRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.batch(records.map(toRow), 5_000, async (batch) => {
      await this.db
        .insertInto('LiveBlobBatch')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['slot', 'txIndex']).doUpdateSet((eb) => ({
            txHash: eb.ref('excluded.txHash'),
            blockNumber: eb.ref('excluded.blockNumber'),
            from: eb.ref('excluded.from'),
            to: eb.ref('excluded.to'),
            blobs: eb.ref('excluded.blobs'),
            topics: eb.ref('excluded.topics'),
            projectId: eb.ref('excluded.projectId'),
          })),
        )
        .execute()
    })
    return records.length
  }

  /** Both ends included, in block order */
  async getBySlotRange(
    from: number,
    to: number,
  ): Promise<LiveBlobBatchRecord[]> {
    const rows = await this.db
      .selectFrom('LiveBlobBatch')
      .selectAll()
      .where('slot', '>=', from)
      .where('slot', '<=', to)
      .orderBy('slot')
      .orderBy('txIndex')
      .execute()
    return rows.map(toRecord)
  }

  /** Both ends included, in block order */
  async getByBlockNumberRange(
    from: number,
    to: number,
  ): Promise<LiveBlobBatchRecord[]> {
    const rows = await this.db
      .selectFrom('LiveBlobBatch')
      .selectAll()
      .where('blockNumber', '>=', from)
      .where('blockNumber', '<=', to)
      .orderBy('slot')
      .orderBy('txIndex')
      .execute()
    return rows.map(toRecord)
  }

  async getPostedSince(fromSlot: number): Promise<LivePostedRecord[]> {
    const { rows } = await sql<{
      projectId: string | null
      blobs: string
      batches: string
      lastSlot: number
      lastBlobs: string
    }>`
      SELECT
        "projectId",
        sum(blobs) AS blobs,
        count(*) AS batches,
        max(slot) AS "lastSlot",
        sum(blobs) FILTER (WHERE slot = "projectLastSlot") AS "lastBlobs"
      FROM (
        SELECT
          "projectId",
          slot,
          blobs,
          max(slot) OVER (PARTITION BY "projectId") AS "projectLastSlot"
        FROM "LiveBlobBatch"
        WHERE slot >= ${fromSlot}
      ) batches
      GROUP BY "projectId"
    `.execute(this.db)
    return rows.map((row) => ({
      projectId: toProjectId(row.projectId),
      blobs: Number(row.blobs),
      batches: Number(row.batches),
      lastSlot: row.lastSlot,
      lastBlobs: Number(row.lastBlobs),
    }))
  }

  async getBucketsSince(
    fromSlot: number,
    bucketSlots: number,
  ): Promise<LiveBucketRecord[]> {
    // Grouped in an outer query: Postgres cannot tell that the bucket width
    // bound twice, in SELECT and GROUP BY, is the same value
    const { rows } = await sql<{
      projectId: string | null
      bucket: number
      blobs: string
    }>`
      SELECT "projectId", bucket, sum(blobs) AS blobs
      FROM (
        SELECT "projectId", slot / ${bucketSlots}::integer AS bucket, blobs
        FROM "LiveBlobBatch"
        WHERE slot >= ${fromSlot}
      ) batches
      GROUP BY "projectId", bucket
    `.execute(this.db)
    return rows.map((row) => ({
      projectId: toProjectId(row.projectId),
      bucket: row.bucket,
      blobs: Number(row.blobs),
    }))
  }

  async deleteBeforeBlock(blockNumber: number): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveBlobBatch')
      .where('blockNumber', '<', blockNumber)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAfterBlock(blockNumber: number): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveBlobBatch')
      .where('blockNumber', '>', blockNumber)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('LiveBlobBatch').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}

function toProjectId(projectId: string | null): ProjectId | undefined {
  return projectId === null ? undefined : ProjectId(projectId)
}
