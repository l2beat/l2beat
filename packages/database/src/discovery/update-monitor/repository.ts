import { ChainId } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { UpdateMonitorRecord, toRecord, toRow } from './entity'
import { selectUpdateMonitor } from './select'

export class UpdateMonitorRepository extends BaseRepository {
  async findLatest(
    name: string,
    chainId: ChainId,
  ): Promise<UpdateMonitorRecord | undefined> {
    const row = await this.db
      .selectFrom('public.update_monitor')
      .select(selectUpdateMonitor)
      .where('project_name', '=', name)
      .where('chain_id', '=', +chainId)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getLatestByProjectNamesAndChain(
    projectNames: string[],
    chainId: ChainId,
  ): Promise<UpdateMonitorRecord[]> {
    const rows = await this.db
      .selectFrom('public.update_monitor')
      .select(selectUpdateMonitor)
      .where('project_name', 'in', projectNames)
      .where('chain_id', '=', +chainId)
      .execute()

    return rows.map(toRecord)
  }

  async upsert(record: UpdateMonitorRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: UpdateMonitorRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('public.update_monitor')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['project_name', 'chain_id']).doUpdateSet((eb) => ({
            block_number: eb.ref('excluded.block_number'),
            unix_timestamp: eb.ref('excluded.unix_timestamp'),
            discovery_json_blob: eb.ref('excluded.discovery_json_blob'),
            config_hash: eb.ref('excluded.config_hash'),
            version: eb.ref('excluded.version'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<UpdateMonitorRecord[]> {
    const rows = await this.db
      .selectFrom('public.update_monitor')
      .select(selectUpdateMonitor)
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.update_monitor')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
