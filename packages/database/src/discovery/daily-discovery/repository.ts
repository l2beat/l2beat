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
      .selectFrom('DailyDiscovery')
      .select(selectDailyDiscovery)
      .where('projectName', '=', name)
      .where('chainId', '=', +chainId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getTimestamps(
    projectName: string,
    chainId: ChainId,
  ): Promise<UnixTime[]> {
    const rows = await this.db
      .selectFrom('DailyDiscovery')
      .select('timestamp')
      .where('projectName', '=', projectName)
      .where('chainId', '=', +chainId)
      .execute()
    return rows.map((row) => UnixTime.fromDate(row.timestamp))
  }

  async upsert(record: DailyDiscoveryRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: DailyDiscoveryRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('DailyDiscovery')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['projectName', 'chainId', 'timestamp'])
            .doUpdateSet((eb) => ({
              version: eb.ref('excluded.version'),
              blockNumber: eb.ref('excluded.blockNumber'),
              configHash: eb.ref('excluded.configHash'),
              discoveryJsonBlob: eb.ref('excluded.discoveryJsonBlob'),
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
      .selectFrom('DailyDiscovery')
      .select(['projectName', 'chainId'])
      .groupBy(['projectName', 'chainId'])
      .execute()

    return rows.map((row) => ({
      projectName: row.projectName,
      chainId: ChainId(row.chainId),
    }))
  }

  async deleteStaleProjectDiscoveries(
    projectName: string,
    chainId: ChainId,
    configHash: Hash256,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('DailyDiscovery')
      .where('projectName', '=', projectName)
      .where('chainId', '=', +chainId)
      .where('configHash', '!=', configHash.toString())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getByProjectAndChain(
    projectName: string,
    chainId: ChainId,
  ): Promise<DailyDiscoveryRecord[]> {
    const rows = await this.db
      .selectFrom('DailyDiscovery')
      .select(selectDailyDiscovery)
      .where('projectName', '=', projectName)
      .where('chainId', '=', +chainId)
      .execute()
    return rows.map(toRecord)
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('DailyDiscovery')
      .select(selectDailyDiscovery)
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('DailyDiscovery').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
