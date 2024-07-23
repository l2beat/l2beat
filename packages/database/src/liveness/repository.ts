import { assert } from '@l2beat/backend-tools'
import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { batchExecute } from '../utils/batchExecute'
import { LivenessRecord, toRecord, toRow } from './entity'
import { selectLiveness } from './select'

export class LivenessRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getAll() {
    const rows = await this.db
      .selectFrom('public.liveness')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByConfigurationIdSince(
    configurationIds: TrackedTxId[],
    since: UnixTime,
  ) {
    const rows = await this.db
      .selectFrom('public.liveness')
      .select(selectLiveness)
      .where('configuration_id', 'in', configurationIds)
      .where('timestamp', '>=', since.toDate())
      .distinctOn(['timestamp', 'configuration_id'])
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async getByConfigurationIdUpTo(
    configurationIds: TrackedTxId[],
    to: UnixTime,
  ) {
    const rows = await this.db
      .selectFrom('public.liveness')
      .select(selectLiveness)
      .where('configuration_id', 'in', configurationIds)
      .where('timestamp', '<', to.toDate())
      .distinctOn(['timestamp', 'configuration_id'])
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async getByConfigurationIdWithinTimeRange(
    configurationIds: string[],
    from: UnixTime,
    to: UnixTime,
  ) {
    assert(from.toNumber() < to.toNumber(), 'From must be less than to')

    const rows = await this.db
      .selectFrom('public.liveness')
      .select(selectLiveness)
      .where('configuration_id', 'in', configurationIds)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .distinctOn(['timestamp', 'configuration_id'])
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: LivenessRecord[], trx?: Transaction) {
    if (records.length === 0) {
      return 0
    }

    const scope = trx ?? this.db
    const rows = records.map(toRow)

    await batchExecute(scope, rows, 10_000, async (trx, batch) => {
      await trx.insertInto('public.liveness').values(batch).execute()
    })

    return rows.length
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Transaction,
  ): Promise<number> {
    const scope = trx ?? this.db
    const result = await scope
      .deleteFrom('public.liveness')
      .where('configuration_id', '=', id.toString())
      .where('timestamp', '>=', deleteFromInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigInTimeRange(
    id: TrackedTxId,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.liveness')
      .where('configuration_id', '=', id)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.liveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getUsedConfigsIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('public.liveness')
      .select('configuration_id')
      .distinctOn('configuration_id')
      .execute()
    return rows.map((row) => row.configuration_id)
  }
}
