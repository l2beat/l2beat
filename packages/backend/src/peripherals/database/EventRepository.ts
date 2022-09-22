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

export interface AggregatedEventRecord extends EventRecord {
  count: number
}

interface AggregatedQueryResult {
  rows: {
    unix_timestamp_aggregated: Date
    event_name: string
    project_id: string
    count: number
  }[]
}

export class EventRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.getDataBoundary = this.wrapAny(this.getDataBoundary)
    this.getAggregatedByProjectAndGranularity = this.wrapGet(
      this.getAggregatedByProjectAndGranularity,
    )
    this.addMany = this.wrapAddMany(this.addMany)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)

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

  async getAggregatedByProjectAndGranularity(
    projectId: ProjectId,
    granularity: 'hour' | 'day',
    from: UnixTime = new UnixTime(0),
  ): Promise<AggregatedEventRecord[]> {
    const knex = await this.knex()

    const raw = (await knex.raw(
      `
      SELECT
        date_trunc(:granularity, unix_timestamp) AS unix_timestamp_aggregated,
        event_name,
        project_id,
        COUNT(*) as count
      FROM
        events
      WHERE
        project_id = :projectId AND unix_timestamp >= :from
      GROUP BY
        event_name,
        project_id,
        unix_timestamp_aggregated
      ORDER BY
        unix_timestamp_aggregated, event_name
      `,
      {
        granularity,
        projectId: projectId.toString(),
        from: from.toDate(),
      },
    )) as unknown as AggregatedQueryResult

    return raw.rows.map(toRecordAggregated)
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

function toRecordAggregated(rowWithCount: {
  unix_timestamp_aggregated: Date
  event_name: string
  project_id: string
  count: number
}): AggregatedEventRecord {
  return {
    timestamp: UnixTime.fromDate(rowWithCount.unix_timestamp_aggregated),
    name: rowWithCount.event_name,
    projectId: ProjectId(rowWithCount.project_id),
    count: +rowWithCount.count,
  }
}
