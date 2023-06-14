import { DiscoveryDiff } from '@l2beat/discovery'
import { Logger } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { UpdateNotifierRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface UpdateNotifierRecord {
  id: number
  createdAt: UnixTime
  updatedAt: UnixTime
  projectName: string
  blockNumber: number
  diff: DiscoveryDiff[]
}

export class UpdateNotifierRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    this.autoWrap<CheckConvention<UpdateNotifierRepository>>(this)
  }

  async findLatestId(): Promise<number | undefined> {
    const knex = await this.knex()
    const row = await knex('update_notifier')
      .select()
      .orderBy('id', 'desc')
      .first()

    return row ? toRecord(row).id : undefined
  }

  async add(
    record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    const knex = await this.knex()
    const row = toRow(record)

    const [insertedResult] = await knex('update_notifier')
      .insert(row)
      .returning('id')

    return insertedResult.id
  }

  async getAll(): Promise<UpdateNotifierRecord[]> {
    const knex = await this.knex()
    const rows = await knex('update_notifier')

    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('update_notifier').delete()
  }
}

function toRecord(row: UpdateNotifierRow): UpdateNotifierRecord {
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
  record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Omit<UpdateNotifierRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    project_name: record.projectName,
    block_number: record.blockNumber,
    diff_json_blob: JSON.stringify(record.diff),
  }
}
