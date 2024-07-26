import { assert } from '@l2beat/backend-tools'
import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { LivenessRecord, toRecord, toRow } from './entity'
import { selectLiveness } from './select'

export class LivenessRepository extends BaseRepository {
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

    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('public.liveness').values(batch).execute()
    })

    return rows.length
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
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
