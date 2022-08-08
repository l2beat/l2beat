import { Logger, ProjectId, UnixTime } from '@l2beat/common'
import { EventRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface EventRecord {
  blockNumber: bigint
  timestamp: UnixTime
  projectId: ProjectId
  name: string
}

export class EventRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.addMany = this.wrapAddMany(this.addMany)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getByProjectAndName(
    projectId: ProjectId,
    name: string,
  ): Promise<EventRecord[]> {
    const knex = await this.knex()
    const rows = await knex('events')
      .where('project_id', projectId.toString())
      .where('event_name', name)
      .select()
    return rows.map(toRecord)
  }

  async addMany(events: EventRecord[]) {
    const rows = events.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('events', rows, 10_000)
    return rows.length
  }

  async getAll(): Promise<EventRecord[]> {
    const knex = await this.knex()
    const rows = await knex('events').select()
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('events').delete()
  }
}

function toRow(record: EventRecord): EventRow {
  return {
    block_number: Number(record.blockNumber),
    unix_timestamp: record.timestamp.toString(),
    project_id: record.projectId.toString(),
    event_name: record.name,
  }
}

function toRecord(row: EventRow): EventRecord {
  return {
    blockNumber: BigInt(row.block_number),
    timestamp: new UnixTime(+row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    name: row.event_name,
  }
}
