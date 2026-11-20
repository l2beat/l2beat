import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LiveCheck } from '../kysely/generated/types'

/** `uncovered`: the live rows did not hold every block of the hours, so nothing was compared */
export type LiveCheckStatus = 'match' | 'mismatch' | 'uncovered'

export interface LiveCheckRecord {
  feature: string
  chain: string
  /** The hours compared, both ends as the hourly indexer takes them */
  from: UnixTime
  to: UnixTime
  status: LiveCheckStatus
  /** How many rows of the hourly indexer were compared. A match of none shows little */
  compared: number
  /** Stored for the hours, not at the head */
  missing: number
  /** Stored at the head, not for the hours */
  extra: number
  /** Stored by both, differently */
  changed: number
  checkedAt: UnixTime
}

function toRecord(row: Selectable<LiveCheck>): LiveCheckRecord {
  return {
    ...row,
    status: row.status as LiveCheckStatus,
    from: UnixTime.fromDate(row.from),
    to: UnixTime.fromDate(row.to),
    checkedAt: UnixTime.fromDate(row.checkedAt),
  }
}

function toRow(record: LiveCheckRecord): Insertable<LiveCheck> {
  return {
    ...record,
    from: UnixTime.toDate(record.from),
    to: UnixTime.toDate(record.to),
    checkedAt: UnixTime.toDate(record.checkedAt),
  }
}

export class LiveCheckRepository extends BaseRepository {
  /**
   * Hours compared again replace their earlier result, unless that was a
   * mismatch: it stays until a person has looked and deleted the row, however
   * the hours compare on a retry
   */
  async upsert(record: LiveCheckRecord): Promise<void> {
    await this.db
      .insertInto('LiveCheck')
      .values(toRow(record))
      .onConflict((cb) =>
        cb
          .columns(['feature', 'chain', 'from', 'to'])
          .doUpdateSet((eb) => ({
            status: eb.ref('excluded.status'),
            compared: eb.ref('excluded.compared'),
            missing: eb.ref('excluded.missing'),
            extra: eb.ref('excluded.extra'),
            changed: eb.ref('excluded.changed'),
            checkedAt: eb.ref('excluded.checkedAt'),
          }))
          .where('LiveCheck.status', '<>', 'mismatch'),
      )
      .execute()
  }

  /** The chains with at least one result of the status for the feature */
  async getChainsWith(
    feature: string,
    status: LiveCheckStatus,
  ): Promise<string[]> {
    const rows = await this.db
      .selectFrom('LiveCheck')
      .select('chain')
      .distinct()
      .where('feature', '=', feature)
      .where('status', '=', status)
      .execute()
    return rows.map((row) => row.chain)
  }

  /**
   * For each chain, how its newest hours of the feature compared, and the
   * end of the newest hours that matched with rows to compare: hours with
   * none match whatever the feature stored at the head
   */
  async getNewestByChain(feature: string): Promise<
    {
      chain: string
      status: LiveCheckStatus
      matchedRowsUntil: UnixTime | undefined
    }[]
  > {
    const [newest, matched] = await Promise.all([
      this.db
        .selectFrom('LiveCheck')
        .distinctOn('chain')
        .select(['chain', 'status'])
        .where('feature', '=', feature)
        .orderBy('chain')
        .orderBy('to', 'desc')
        .orderBy('checkedAt', 'desc')
        .execute(),
      this.db
        .selectFrom('LiveCheck')
        .select((eb) => ['chain', eb.fn.max('to').as('until')])
        .where('feature', '=', feature)
        .where('status', '=', 'match')
        .where('compared', '>', 0)
        .groupBy('chain')
        .execute(),
    ])
    const until = new Map(matched.map((row) => [row.chain, row.until]))
    return newest.map((row) => {
      const matchedUntil = until.get(row.chain)
      return {
        chain: row.chain,
        status: row.status as LiveCheckStatus,
        matchedRowsUntil: matchedUntil && UnixTime.fromDate(matchedUntil),
      }
    })
  }

  async getAll(): Promise<LiveCheckRecord[]> {
    const rows = await this.db.selectFrom('LiveCheck').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('LiveCheck').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
