import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase } from '../kysely'
import { DailyDiscovery, toRecord, toRow } from './entity'
import { selectDailyDiscovery } from './select'

export class DailyDiscoveryRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findLatest(name: string, chainId: ChainId) {
    const row = await this.db
      .selectFrom('public.daily_discovery')
      .select(selectDailyDiscovery)
      .where((eb) =>
        eb.and([eb('project_name', '=', name), eb('chain_id', '=', +chainId)]),
      )
      .orderBy('unix_timestamp', 'desc')
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async getTimestamps(projectName: string, chainId: ChainId) {
    const rows = await this.db
      .selectFrom('public.daily_discovery')
      .select('unix_timestamp')
      .where((eb) =>
        eb.and([
          eb('project_name', '=', projectName),
          eb('chain_id', '=', +chainId),
        ]),
      )
      .execute()

    return rows.map((row) => UnixTime.fromDate(row.unix_timestamp))
  }

  async addOrUpdate(record: DailyDiscovery) {
    const row = toRow(record)

    await this.db
      .insertInto('public.daily_discovery')
      .values(row)
      .onConflict((cb) =>
        cb
          .columns(['project_name', 'chain_id', 'unix_timestamp'])
          .doUpdateSet(row),
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
  ) {
    return this.db
      .deleteFrom('public.daily_discovery')
      .where((eb) =>
        eb.and([
          eb('project_name', '=', projectName),
          eb('chain_id', '=', +chainId),
          eb('config_hash', '!=', configHash.toString()),
        ]),
      )
      .execute()
  }

  async getProject(projectName: string, chainId: ChainId) {
    const rows = await this.db
      .selectFrom('public.daily_discovery')
      .select(selectDailyDiscovery)
      .where((eb) =>
        eb.and([
          eb('project_name', '=', projectName),
          eb('chain_id', '=', +chainId),
        ]),
      )
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

  deleteAll() {
    return this.db.deleteFrom('public.daily_discovery').execute()
  }
}
