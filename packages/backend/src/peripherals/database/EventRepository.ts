import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { EventRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface EventRecord {
  timestamp: UnixTime
  name: string
  projectId: ProjectId
}

export class EventRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.addMany = this.wrapAddMany(this.addMany)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.getByProjectAndName = this.wrapGet(this.getByProjectAndName)
    this.getByProject = this.wrapGet(this.getByProject)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getDataBoundary(): Promise<
    Map<string, { earliest: UnixTime; latest: UnixTime }>
  > {
    const knex = await this.knex()
    const rows = await knex('events')
      .min('unix_timestamp')
      .max('unix_timestamp')
      .groupBy(['project_id', 'event_name'])
      .select('project_id', 'event_name')

    return new Map(
      rows.map((row) => [
        `${row.project_id}-${row.event_name}`,
        {
          earliest: UnixTime.fromDate(row.min),
          latest: UnixTime.fromDate(row.max),
        },
      ]),
    )
  }

  async getByProject(
    projectId: ProjectId,
    from: UnixTime = new UnixTime(0),
  ): Promise<EventRecord[]> {
    const knex = await this.knex()
    const rows = await knex('events')
      .where('project_id', projectId.toString())
      .where('unix_timestamp', '>=', from.toDate())
      .select()
      .orderBy(['unix_timestamp', 'event_name'])
    return rows.map(toRecord)
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
    unix_timestamp: record.timestamp.toDate(),
    event_name: record.name,
    project_id: record.projectId.toString(),
  }
}

function toRecord(row: EventRow): EventRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    name: row.event_name,
    projectId: ProjectId(row.project_id),
  }
}
