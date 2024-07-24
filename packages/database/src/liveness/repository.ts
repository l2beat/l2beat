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
    if (configurationIds.length === 0) {
      return []
    }

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
    if (configurationIds.length === 0) {
      return []
    }

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
    if (configurationIds.length === 0) {
      return []
    }

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

  async addMany(records: LivenessRecord[]) {
    if (records.length === 0) {
      return 0
    }

    const rows = records.map(toRow)

    await batchExecute(this.db, rows, 10_000, async (trx, batch) => {
      await trx.insertInto('public.liveness').values(batch).execute()
    })

    return rows.length
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db
    return await scope
      .deleteFrom('public.liveness')
      .where('configuration_id', '=', id.toString())
      .where('timestamp', '>=', deleteFromInclusive.toDate())
      .execute()
  }

  async deleteAll() {
    return await this.db.deleteFrom('public.liveness').execute()
  }
}
