import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { EventRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface EventRecord {
  timestamp: UnixTime
  name: string
  projectId: ProjectId
  count: number
  timeSpan: 'hourly' | 'sixHourly' | 'daily'
}

export class EventRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.addMany = this.wrapAddMany(this.addMany)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.getByProjectAndName = this.wrapGet(this.getByProjectAndName)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getDataBoundary(): Promise<
    Map<string, { earliest: UnixTime; latest: UnixTime }>
  > {
    const knex = await this.knex()
    const rows = await knex('events')
      .where('time_span', 'hourly')
      .min('unix_timestamp')
      .max('unix_timestamp')
      .groupBy(['project_id', 'event_name'])
      .select('project_id', 'event_name')

    return new Map(
      rows.map((row) => [
        `${row.project_id}-${row.event_name}`,
        {
          earliest: new UnixTime(parseInt(row.min)),
          latest: new UnixTime(parseInt(row.max)),
        },
      ]),
    )
  }

  async getByProjectAndName(
    projectId: ProjectId,
    name: string,
    timeSpan: 'hourly' | 'sixHourly' | 'daily',
  ): Promise<EventRecord[]> {
    const knex = await this.knex()
    const rows = await knex('events')
      .where('project_id', projectId.toString())
      .where('event_name', name)
      .where('time_span', timeSpan)
      .select()
    return rows.map(toRecord)
  }

  async getAggregatedCount(
    projectId: ProjectId,
    name: string,
    from: UnixTime,
    to: UnixTime,
  ): Promise<number> {
    const knex = await this.knex()

    const [{ sum }] = await knex('events')
      .where('project_id', projectId.toString())
      .where('event_name', name)
      .where('time_span', 'hourly')
      .where('unix_timestamp', '>=', from.toString())
      .where('unix_timestamp', '<=', to.toString())
      .sum('count')
    //todo rethink if we want to sum in db
    return Number(sum)
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
    unix_timestamp: record.timestamp.toString(),
    event_name: record.name,
    project_id: record.projectId.toString(),
    count: record.count,
    time_span: record.timeSpan,
  }
}

function toRecord(row: EventRow): EventRecord {
  return {
    timestamp: new UnixTime(+row.unix_timestamp),
    name: row.event_name,
    projectId: ProjectId(row.project_id),
    count: row.count,
    timeSpan: row.time_span,
  }
}
