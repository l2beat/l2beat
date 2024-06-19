import { PostgresDatabase, Transaction } from '../kysely'
import { selectTrackedTxConfig } from './select'

import { TrackedTxId } from '@l2beat/shared'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { DeleteResult } from 'kysely'
import { TrackedTxsConfig, toRecord, toRow } from './entity'

export class TrackedTxsConfigsRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getAll(trx?: Transaction) {
    const scope = trx ?? this.db

    const rows = await scope
      .selectFrom('public.tracked_txs_configs')
      .select(selectTrackedTxConfig)
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: TrackedTxsConfig[], trx?: Transaction) {
    if (!records.length) {
      return []
    }
    const scope = trx ?? this.db

    const rows = records.map(toRow)

    const insertedRows = await scope
      .insertInto('public.tracked_txs_configs')
      .values(rows)
      .returning('id')
      .execute()

    return insertedRows
      .map((row) => (row.id ? TrackedTxId.unsafe(row.id) : undefined))
      .filter(notUndefined)
  }

  async getByProjectIdAndType(
    projectId: ProjectId,
    type: TrackedTxsConfigType,
  ) {
    const rows = await this.db
      .selectFrom('public.tracked_txs_configs')
      .select(selectTrackedTxConfig)
      .where((eb) =>
        eb.and([eb('project_id', '=', projectId), eb('type', '=', type)]),
      )
      .execute()

    return rows.map(toRecord)
  }

  async findLatestSyncedTimestampByProjectIdAndSubtype(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
  ) {
    const row = await this.db
      .selectFrom('public.tracked_txs_configs')
      .select([
        this.db.fn.max('last_synced_timestamp').as('last_synced_timestamp'),
      ])
      .where((eb) =>
        eb.and([eb('project_id', '=', projectId), eb('subtype', '=', subtype)]),
      )
      .executeTakeFirst()

    return row?.last_synced_timestamp
      ? UnixTime.fromDate(row.last_synced_timestamp)
      : undefined
  }

  async findUnusedConfigurationsIds() {
    const rows = await this.db
      .selectFrom('public.tracked_txs_configs as c')
      .select('c.id')
      .leftJoin('public.liveness', 'c.id', 'public.liveness.tracked_tx_id')
      .leftJoin('public.l2_costs as l2', 'c.id', 'l2.tracked_tx_id')
      .groupBy('c.id')
      .having((eb) =>
        eb.and([
          eb(this.db.fn.count('public.liveness.tracked_tx_id'), '=', 0),
          eb(this.db.fn.count('public.l2_costs.tracked_tx_id'), '=', 0),
        ]),
      )
      .execute()

    return rows.map((row) => TrackedTxId.unsafe(row.id))
  }

  setLastSyncedTimestamp(
    trackedTxId: TrackedTxId,
    lastSyncedTimestamp: UnixTime,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    return scope
      .updateTable('public.tracked_txs_configs')
      .set('last_synced_timestamp', lastSyncedTimestamp.toDate())
      .where('id', '=', trackedTxId)

      .execute()
  }

  setManyLastSyncedTimestamp(
    trackedTxIds: TrackedTxId[],
    lastSyncedTimestamp: UnixTime,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    return scope
      .updateTable('public.tracked_txs_configs')
      .set('last_synced_timestamp', lastSyncedTimestamp.toDate())
      .where('id', 'in', trackedTxIds)

      .execute()
  }

  setUntilTimestamp(
    trackedTxId: TrackedTxId,
    untilTimestamp: UnixTime | undefined,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    return scope
      .updateTable('public.tracked_txs_configs')
      .set(
        'until_timestamp_exclusive',
        untilTimestamp ? untilTimestamp.toDate() : null,
      )
      .where('id', '=', trackedTxId)

      .execute()
  }
  deleteAll() {
    return this.db.deleteFrom('public.tracked_txs_configs').execute()
  }

  deleteMany(
    trackedTxIds: TrackedTxId[],
    trx?: Transaction,
  ): Promise<DeleteResult[]> {
    if (trackedTxIds.length === 0) {
      return Promise.resolve([])
    }

    const scope = trx ?? this.db

    return scope
      .deleteFrom('public.tracked_txs_configs')
      .where('id', 'in', trackedTxIds)
      .execute()
  }
}
