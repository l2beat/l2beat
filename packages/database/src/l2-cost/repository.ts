import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { L2Cost, toRecord, toRecordWithProjectId, toRow } from './entity'
import { joinTrackedTxs } from './join'
import { selectL2Cost } from './select'

export class L2CostRepository {
  constructor(private readonly db: PostgresDatabase) {}
  async getAll() {
    const rows = await this.db
      .selectFrom('public.l2_costs')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async addMany(records: L2Cost[], trx?: Transaction): Promise<number> {
    if (records.length === 0) {
      return 0
    }
    const scope = trx ?? this.db
    const rows = records.map(toRow)
    await scope.insertInto('public.l2_costs').values(rows).execute()
    return rows.length
  }

  async getWithProjectIdByTimeRange(timeRange: [UnixTime, UnixTime]) {
    const [from, to] = timeRange

    const rows = await this.db
      .selectFrom('public.l2_costs')
      .where((eb) =>
        eb.and([
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<=', to.toDate()),
        ]),
      )
      .innerJoin(...joinTrackedTxs)
      .select([
        ...selectL2Cost.map((column) => `public.l2_costs.${column}` as const),
        'public.tracked_txs_configs.project_id',
      ])
      .distinct()
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecordWithProjectId)
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db
    return scope
      .deleteFrom('public.l2_costs')
      .where((eb) =>
        eb.and([
          eb('tracked_tx_id', '=', id),
          eb('timestamp', '>=', deleteFromInclusive.toDate()),
        ]),
      )
      .execute()
  }

  deleteAll() {
    return this.db.deleteFrom('public.l2_costs').execute()
  }
}
