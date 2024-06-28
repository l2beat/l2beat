import { TrackedTxId } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { L2Cost, toRecord, toRecordWithProjectId, toRow } from './entity'
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

    const l2costsRows = await this.db
      .selectFrom('public.l2_costs')
      .where((eb) =>
        eb.and([
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<=', to.toDate()),
        ]),
      )
      .select([
        ...selectL2Cost.map((column) => `public.l2_costs.${column}` as const),
      ])
      .distinctOn('tx_hash')
      .orderBy('tx_hash', 'asc')
      .orderBy('timestamp', 'asc')
      .execute()

    if (l2costsRows.length === 0) {
      return []
    }

    const configRows = await this.db
      .selectFrom('public.indexer_configurations')
      .where(
        'id',
        'in',
        l2costsRows.map((r) => r.tracked_tx_id),
      )
      .select(['id', 'properties'])
      .execute()

    const resultRows = l2costsRows.map((l2costsRow) => {
      const config = configRows.find(
        (configRow) => configRow.id === l2costsRow.tracked_tx_id,
      )
      assert(config?.id, `Cannot found config with id: ${config?.id}`)
      return {
        ...l2costsRow,
        project_id: JSON.parse(config.properties).projectId,
      }
    })

    return resultRows.map(toRecordWithProjectId)
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

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    return await this.db
      .deleteFrom('public.l2_costs')
      .where((eb) =>
        eb.and([
          eb('tracked_tx_id', '=', configId),
          eb('timestamp', '>=', fromInclusive.toDate()),
          eb('timestamp', '<=', toInclusive.toDate()),
        ]),
      )
      .execute()
  }

  // #region Status page

  async getUsedConfigsIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('public.l2_costs')
      .select(['tracked_tx_id'])
      .distinctOn('tracked_tx_id')
      .execute()
    return rows.map((row) => row.tracked_tx_id)
  }

  // #endregion

  deleteAll() {
    return this.db.deleteFrom('public.l2_costs').execute()
  }
}
