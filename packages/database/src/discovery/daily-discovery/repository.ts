import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { DailyDiscoveryRecord, toRecord, toRow } from './entity'
import { selectDailyDiscovery } from './select'

export class DailyDiscoveryRepository extends BaseRepository {
  async findLatest(
    name: string,
    chainId: ChainId,
  ): Promise<DailyDiscoveryRecord | undefined> {
    const row = await this.db
      .selectFrom('public.daily_discovery')
      .select(selectDailyDiscovery)
      .where('project_name', '=', name)
      .where('chain_id', '=', +chainId)
      .orderBy('unix_timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getTimestamps(
    projectName: string,
    chainId: ChainId,
  ): Promise<UnixTime[]> {
    const rows = await this.db
      .selectFrom('public.daily_discovery')
      .select('unix_timestamp')
      .where('project_name', '=', projectName)
      .where('chain_id', '=', +chainId)
      .execute()
    return rows.map((row) => UnixTime.fromDate(row.unix_timestamp))
  }

  async upsert(record: DailyDiscoveryRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: DailyDiscoveryRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('public.daily_discovery')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['project_name', 'chain_id', 'unix_timestamp'])
            .doUpdateSet((eb) => ({
              version: eb.ref('excluded.version'),
              block_number: eb.ref('excluded.block_number'),
              config_hash: eb.ref('excluded.config_hash'),
              discovery_json_blob: eb.ref('excluded.discovery_json_blob'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async getAvailableProjects(): Promise<
    { projectName: string; chainId: ChainId }[]
  > {
    const rows = await this.db
      .selectFrom('public.daily_discovery')
      .select(['project_name', 'chain_id'])
      .groupBy(['project_name', 'chain_id'])
      .execute()

    return rows.map((row) => ({
      projectName: row.project_name,
      chainId: ChainId(row.chain_id),
    }))
  }

  async deleteStaleProjectDiscoveries(
    projectName: string,
    chainId: ChainId,
    configHash: Hash256,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.daily_discovery')
      .where('project_name', '=', projectName)
      .where('chain_id', '=', +chainId)
      .where('config_hash', '!=', configHash.toString())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getByProjectAndChain(
    projectName: string,
    chainId: ChainId,
  ): Promise<DailyDiscoveryRecord[]> {
    const rows = await this.db
      .selectFrom('public.daily_discovery')
      .select(selectDailyDiscovery)
      .where('project_name', '=', projectName)
      .where('chain_id', '=', +chainId)
      .execute()
    return rows.map(toRecord)
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('public.daily_discovery')
      .select(selectDailyDiscovery)
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.daily_discovery')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
