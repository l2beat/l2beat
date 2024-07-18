import { assert } from '@l2beat/backend-tools'
import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
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
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', configurationIds),
          eb('timestamp', '>=', since.toDate()),
        ]),
      )
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
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', configurationIds),
          eb('timestamp', '<', to.toDate()),
        ]),
      )
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
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', configurationIds),
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<', to.toDate()),
        ]),
      )
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

    await this.db.insertInto('public.liveness').values(rows).execute()

    return rows.length
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    return scope
      .deleteFrom('public.liveness')
      .where((eb) =>
        eb.and([
          eb('configuration_id', '=', id.toString()),
          eb('timestamp', '>=', deleteFromInclusive.toDate()),
        ]),
      )
      .execute()
  }

  async deleteAll() {
    return await this.db.deleteFrom('public.liveness').execute()
  }
}
