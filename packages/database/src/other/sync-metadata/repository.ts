import { assert, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, sql } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { compiledToSqlQuery } from '../../utils/compiledToSqlQuery'
import {
  type SyncMetadataRecord,
  toRecord,
  toRow,
  toRowWithoutTarget,
} from './entity'

export class SyncMetadataRepository extends BaseRepository {
  async upsert(record: Insertable<SyncMetadataRecord>): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: Insertable<SyncMetadataRecord>[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('SyncMetadata')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['feature', 'id']).doUpdateSet((eb) => ({
            target: eb.ref('excluded.target'),
            syncedUntil: eb.ref('excluded.syncedUntil'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async updateSyncedUntil(
    feature: SyncMetadataRecord['feature'],
    ids: string[],
    syncedUntil: UnixTime,
  ): Promise<void> {
    await this.db
      .updateTable('SyncMetadata')
      .set({ syncedUntil: UnixTime.toDate(syncedUntil) })
      .where('feature', '=', feature)
      .where('id', 'in', ids)
      .execute()
  }

  async updateSyncedUntilMany(
    records: Omit<Insertable<SyncMetadataRecord>, 'target'>[],
  ) {
    const rows = records.map(toRowWithoutTarget)
    console.log(
      compiledToSqlQuery(
        this.db
          .updateTable('SyncMetadata')
          .from(values(rows, 'updateSet', { syncedUntil: 'timestamp' }))
          .set((eb) => {
            return {
              syncedUntil: eb.ref('updateSet.syncedUntil'),
            }
          })
          .whereRef('SyncMetadata.feature', '=', 'updateSet.feature')
          .whereRef('SyncMetadata.id', '=', 'updateSet.id')
          .compile(),
      ),
    )
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .updateTable('SyncMetadata')
        .from(values(batch, 'updateSet', { syncedUntil: 'timestamp' }))
        .set((eb) => {
          return {
            syncedUntil: eb.ref('updateSet.syncedUntil'),
          }
        })
        .whereRef('SyncMetadata.feature', '=', 'updateSet.feature')
        .whereRef('SyncMetadata.id', '=', 'updateSet.id')
        .execute()
    })
  }

  async getAll(): Promise<SyncMetadataRecord[]> {
    const rows = await this.db.selectFrom('SyncMetadata').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('SyncMetadata').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}

function values<R extends Record<string, unknown>, A extends string>(
  records: R[],
  alias: A,
  castColumns?: Record<string, string>,
) {
  if (records.length === 0) {
    return sql<R>`(values ())`.as<A>(alias)
  }

  // Assume there's at least one record and all records
  // have the same keys.
  const firstRecord = records[0]
  assert(firstRecord, 'No records provided')
  const keys = Object.keys(firstRecord)

  // Transform the records into a list of lists such as
  // ($1, $2, $3), ($4, $5, $6)
  const values = sql.join(
    records.map(
      (r) =>
        sql`(${sql.join(
          keys.map((k) => {
            const value = r[k]
            const cast = castColumns?.[k]
            return cast ? sql`${value}::${sql.raw(cast)}` : value
          }),
        )})`,
    ),
  )

  // Create the alias `v(id, v1, v2)` that specifies the table alias
  // AND a name for each column.
  const wrappedAlias = sql.ref(alias)
  const wrappedColumns = sql.join(keys.map(sql.ref))
  const aliasSql = sql`${wrappedAlias}(${wrappedColumns})`

  // Finally create a single `AliasedRawBuilder` instance of the
  // whole thing. Note that we need to explicitly specify
  // the alias type using `.as<A>` because we are using a
  // raw sql snippet as the alias.
  return sql<R>`(values ${values})`.as<A>(aliasSql)
}
