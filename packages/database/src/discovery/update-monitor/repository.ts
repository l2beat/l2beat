import { ChainId } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../../kysely'
import { UpdateMonitorRecord, toRecord, toRow } from './entity'
import { selectUpdateMonitor } from './select'

export class UpdateMonitorRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findLatest(
    name: string,
    chainId: ChainId,
  ): Promise<UpdateMonitorRecord | undefined> {
    const row = await this.db
      .selectFrom('public.update_monitor')
      .select(selectUpdateMonitor)
      .where('project_name', '=', name)
      .where('chain_id', '=', +chainId)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async addOrUpdate(
    record: UpdateMonitorRecord,
    trx?: Transaction,
  ): Promise<string> {
    const scope = trx ?? this.db

    const row = toRow(record)

    await scope
      .insertInto('public.update_monitor')
      .values(row)
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

    return `${record.projectName} | block_number: ${record.blockNumber}`
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
