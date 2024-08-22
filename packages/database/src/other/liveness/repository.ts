import { TrackedTxId } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { LivenessRecord, toRecord, toRow } from './entity'
import { selectLiveness } from './select'

export class LivenessRepository extends BaseRepository {
  async getAll(): Promise<LivenessRecord[]> {
    const rows = await this.db.selectFrom('liveness').selectAll().execute()
    return rows.map(toRecord)
  }

  async getByConfigurationIdSince(
    configurationIds: TrackedTxId[],
    since: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (configurationIds.length === 0) return []

    const rows = await this.db
      .selectFrom('liveness')
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
  ): Promise<LivenessRecord[]> {
    if (configurationIds.length === 0) return []

    const rows = await this.db
      .selectFrom('liveness')
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
  ): Promise<LivenessRecord[]> {
    if (configurationIds.length === 0) return []

    assert(from.toNumber() < to.toNumber(), 'From must be less than to')
    const rows = await this.db
      .selectFrom('liveness')
      .select(selectLiveness)
      .where('configuration_id', 'in', configurationIds)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .distinctOn(['timestamp', 'configuration_id'])
      .orderBy('timestamp', 'desc')
      .execute()
    return rows.map(toRecord)
  }

  async insertMany(records: LivenessRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('liveness').values(batch).execute()
    })
    return rows.length
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('liveness')
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
      .deleteFrom('liveness')
      .where('configuration_id', '=', id)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('liveness').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getUsedConfigsIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('liveness')
      .select('configuration_id')
      .distinctOn('configuration_id')
      .execute()
    return rows.map((row) => row.configuration_id)
  }
}
