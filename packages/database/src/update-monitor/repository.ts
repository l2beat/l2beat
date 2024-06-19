import { ChainId } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { UpdateMonitor, toRecord, toRow } from './entity'
import { selectUpdateMonitor } from './select'

export class UpdateMonitorRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findLatest(
    name: string,
    chainId: ChainId,
  ): Promise<UpdateMonitor | undefined> {
    const row = await this.db
      .selectFrom('update_monitor')
      .select(selectUpdateMonitor)
      .where((eb) =>
        eb.and([eb('project_name', '=', name), eb('chain_id', '=', +chainId)]),
      )
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async addOrUpdate(record: UpdateMonitor, trx?: Transaction): Promise<string> {
    const scope = trx ?? this.db

    const row = toRow(record)

    await scope
      .insertInto('update_monitor')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['project_name', 'chain_id']).doUpdateSet({
          block_number: row.block_number,
          unix_timestamp: row.unix_timestamp,
          discovery_json_blob: row.discovery_json_blob,
          config_hash: row.config_hash,
          version: row.version,
        }),
      )
      .execute()

    return `${record.projectName} | block_number: ${record.blockNumber}`
  }

  async getAll(): Promise<UpdateMonitor[]> {
    const rows = await this.db
      .selectFrom('update_monitor')
      .select(selectUpdateMonitor)
      .execute()

    return rows.map(toRecord)
  }

  deleteAll() {
    return this.db.deleteFrom('update_monitor').execute()
  }
}
