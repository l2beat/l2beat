import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { DailyDiscoveryRecord, toRecord, toRow } from './entity'
import { selectDailyDiscovery } from './select'

export class DailyDiscoveryRepository extends BaseRepository {
  async findLatest(name: string, chainId: ChainId) {
    const row = await this.db
      .selectFrom('public.daily_discovery')
      .select(selectDailyDiscovery)
      .where('project_name', '=', name)
      .where('chain_id', '=', +chainId)
      .orderBy('unix_timestamp', 'desc')
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async getTimestamps(projectName: string, chainId: ChainId) {
    const rows = await this.db
      .selectFrom('public.daily_discovery')
      .select('unix_timestamp')
      .where('project_name', '=', projectName)
      .where('chain_id', '=', +chainId)
      .execute()

    return rows.map((row) => UnixTime.fromDate(row.unix_timestamp))
  }

  async upsert(record: DailyDiscoveryRecord) {
    const row = toRow(record)

    await this.db
      .insertInto('public.daily_discovery')
      .values(row)
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

    return `${
      record.projectName
    } | block_number: ${record.blockNumber.toString()}`
  }

  async getAvailableProjects() {
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

  async getProject(projectName: string, chainId: ChainId) {
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
