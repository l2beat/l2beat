import { DiscoveryDiff } from '@l2beat/discovery'
import { Logger, UnixTime } from '@l2beat/shared'
import { NotificationManagerRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface NotificationManagerRecord {
  id: number
  createdAt: UnixTime
  updatedAt: UnixTime
  projectName: string
  blockNumber: number
  diff: DiscoveryDiff[]
}

export class NotificationManagerRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    this.autoWrap<CheckConvention<NotificationManagerRepository>>(this)
  }

  async findLatestId(): Promise<number | undefined> {
    const knex = await this.knex()
    const row = await knex('notification_manager')
      .select()
      .orderBy('id', 'desc')
      .first()

    return row ? toRecord(row).id : undefined
  }

  async add(
    record: Omit<NotificationManagerRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    const knex = await this.knex()
    const row = toRow(record)

    const [insertedResult] = await knex('notification_manager')
      .insert(row)
      .returning('id')

    return insertedResult.id
  }

  async getAll(): Promise<NotificationManagerRecord[]> {
    const knex = await this.knex()
    const rows = await knex('notification_manager')

    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('notification_manager').delete()
  }
}

function toRecord(row: NotificationManagerRow): NotificationManagerRecord {
  return {
    id: row.id,
    createdAt: UnixTime.fromDate(row.created_at),
    updatedAt: UnixTime.fromDate(row.updated_at),
    projectName: row.project_name,
    blockNumber: row.block_number,
    diff: row.diff_json_blob as unknown as DiscoveryDiff[],
  }
}

function toRow(
  record: Omit<NotificationManagerRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Omit<NotificationManagerRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    project_name: record.projectName,
    block_number: record.blockNumber,
    diff_json_blob: JSON.stringify(record.diff),
  }
}
