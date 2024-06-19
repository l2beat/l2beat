import { assert } from '@l2beat/backend-tools'
import { TrackedTxId } from '@l2beat/shared'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import {
  Liveness,
  toRecord,
  toRecordWithTimestampAndSubtype,
  toRow,
  toTransactionRecordWithTimestamp,
} from './entity'

export class LivenessRepository {
  constructor(private readonly db: PostgresDatabase) {}
  async getAll() {
    const rows = await this.db
      .selectFrom('public.liveness')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getWithSubtypeDistinctTimestamp(projectId: ProjectId) {
    const rows = await this.db
      .selectFrom('public.liveness as l')
      .innerJoin('public.tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select(['l.timestamp', 'c.subtype', 'c.project_id'])
      .where((eb) =>
        eb.and([
          eb('c.project_id', '=', projectId.toString()),
          eb('c.subtype', 'is not', null),
        ]),
      )
      .distinctOn('l.timestamp')
      .orderBy('l.timestamp', 'desc')
      .$narrowType<{ subtype: TrackedTxsConfigSubtype }>()
      .execute()

    return rows.map(toRecordWithTimestampAndSubtype)
  }

  /**
   *
   * @param projectId Filter only transactions for a specific project.
   * @param subtype Filter only transactions of a specific subtype.
   * @param from Lower bound timestamp, inclusive.
   * @param to Upper bound timestamp, exclusive.
   * @returns An array of transactions that fall within the specified time range.
   */
  async getTransactionsWithinTimeRange(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    from: UnixTime,
    to: UnixTime,
  ) {
    assert(from.toNumber() < to.toNumber(), 'From must be less than to')

    const rows = await this.db
      .selectFrom('public.liveness as l')
      .select(['l.timestamp', 'l.block_number', 'l.tx_hash', 'l.tracked_tx_id'])
      .innerJoin('public.tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .where((eb) =>
        eb.and([
          eb('c.project_id', '=', projectId.toString()),
          eb('c.subtype', '=', subtype.toString()),
          eb('l.timestamp', '>=', from.toDate()),
          eb('l.timestamp', '<', to.toDate()),
        ]),
      )
      .orderBy('l.timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getTransactionWithSubtypeDistinctTimestamp(
    projectId: ProjectId,
    since: UnixTime,
  ) {
    const rows = await this.db
      .selectFrom('public.liveness as l')
      .innerJoin('public.tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select(['l.timestamp', 'c.subtype', 'l.tx_hash', 'c.project_id'])
      .where((eb) =>
        eb.and([
          eb('c.project_id', '=', projectId.toString()),
          eb('l.timestamp', '>=', since.toDate()),
          eb('c.subtype', 'is not', null),
        ]),
      )
      .distinctOn('l.timestamp')
      .orderBy('l.timestamp', 'desc')
      .$narrowType<{ subtype: TrackedTxsConfigSubtype }>()
      .execute()

    return rows.map(toTransactionRecordWithTimestamp)
  }

  async getByProjectIdAndType(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    since: UnixTime,
  ) {
    const rows = await this.db
      .selectFrom('public.liveness as l')
      .innerJoin('public.tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select(['l.timestamp', 'c.subtype', 'c.project_id'])
      .where((eb) =>
        eb.and([
          eb('c.project_id', '=', projectId.toString()),
          eb('c.subtype', '=', subtype),
          eb('l.timestamp', '>=', since.toDate()),
        ]),
      )
      .distinctOn('l.timestamp')
      .orderBy('l.timestamp', 'desc')
      .$narrowType<{ subtype: TrackedTxsConfigSubtype }>()
      .execute()

    return rows.map(toRecordWithTimestampAndSubtype)
  }

  async addMany(records: Liveness[]) {
    const rows = records.map(toRow)

    await this.db.insertInto('public.liveness').values(rows).execute()

    return rows.length
  }

  deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    return scope
      .deleteFrom('public.liveness')
      .where((eb) =>
        eb.and([
          eb('tracked_tx_id', '=', id.toString()),
          eb('timestamp', '>=', deleteFromInclusive.toDate()),
        ]),
      )
      .execute()
  }

  deleteAll() {
    return this.db.deleteFrom('public.liveness').execute()
  }
}
