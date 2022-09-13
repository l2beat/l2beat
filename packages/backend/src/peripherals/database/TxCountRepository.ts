import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { TxCountRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

interface TxCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  blockNumber: number
  count: number
}

export class TxCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: TxCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('tx_count').insert(row)
    return `${row.project_id}-${row.block_number}`
  }

  async addMany(records: TxCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('tx_count').insert(rows)
    return rows.length
  }

  async findLatestByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const row = await knex('tx_count')
      .where('project_id', projectId.toString())
      .orderBy('block_number', 'desc')
      .first()

    return row ? toRecord(row) : undefined
  }

  async getBlockNumbersByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const rows = await knex('tx_count')
      .where('project_id', projectId.toString())
      .select('block_number')
      .orderBy('block_number', 'desc')
    return rows.map((row) => row.block_number)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('tx_count').delete()
  }
}

function toRow(record: TxCountRecord): TxCountRow {
  return {
    unix_timestamp: record.timestamp.toString(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}

function toRecord(row: TxCountRow): TxCountRecord {
  return {
    timestamp: new UnixTime(+row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    blockNumber: row.block_number,
    count: row.count,
  }
}
