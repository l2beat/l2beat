import { sortDeep } from '@l2beat/discovery'
import { type json, UnixTime } from '@l2beat/shared-pure'
import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { WatchMonitor } from '../kysely/generated/types'

export interface WatchMonitorRecord {
  name: string
  timestamp: UnixTime | null
  values: Record<string, json> | null
  notifiedValues: Record<string, json> | null
  lastAttemptAt: UnixTime | null
  lastError: string | null
}

export interface WatchObservation {
  name: string
  timestamp: UnixTime
  values: Record<string, json>
}

export function toRecord(row: Selectable<WatchMonitor>): WatchMonitorRecord {
  return {
    name: row.name,
    timestamp: row.timestamp ? UnixTime.fromDate(row.timestamp) : null,
    values: canonicalizeValues(row.valuesJsonBlob),
    notifiedValues: canonicalizeValues(row.notifiedValuesJsonBlob),
    lastAttemptAt: row.lastAttemptAt
      ? UnixTime.fromDate(row.lastAttemptAt)
      : null,
    lastError: row.lastError,
  }
}

// PostgreSQL JSONB does not preserve object key order; re-sorting on read
// keeps array-of-objects comparisons deterministic across round trips.
function canonicalizeValues(blob: unknown): Record<string, json> | null {
  if (blob === null || blob === undefined) {
    return null
  }
  return sortDeep(blob as json) as Record<string, json>
}

export class WatchMonitorRepository extends BaseRepository {
  async findLatest(name: string): Promise<WatchMonitorRecord | undefined> {
    const row = await this.db
      .selectFrom('WatchMonitor')
      .selectAll()
      .where('name', '=', name)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  // Only advances the stored snapshot: a late timed-out run cannot regress a
  // newer observation already persisted by a subsequent tick.
  async upsertObservation(observation: WatchObservation): Promise<boolean> {
    const timestamp = UnixTime.toDate(observation.timestamp)
    const result = await this.db
      .insertInto('WatchMonitor')
      .values({
        name: observation.name,
        timestamp,
        valuesJsonBlob: JSON.stringify(observation.values),
        notifiedValuesJsonBlob: null,
        lastAttemptAt: timestamp,
        lastError: null,
      })
      .onConflict((cb) =>
        cb
          .columns(['name'])
          .doUpdateSet((eb) => ({
            timestamp: eb.ref('excluded.timestamp'),
            valuesJsonBlob: eb.ref('excluded.valuesJsonBlob'),
            lastAttemptAt: eb.ref('excluded.lastAttemptAt'),
            lastError: null,
          }))
          .where((eb) =>
            eb.or([
              eb('WatchMonitor.timestamp', 'is', null),
              eb('WatchMonitor.timestamp', '<=', eb.ref('excluded.timestamp')),
            ]),
          ),
      )
      .executeTakeFirst()

    return Number(result.numInsertedOrUpdatedRows ?? 0) > 0
  }

  async markNotified(
    name: string,
    timestamp: UnixTime,
    notifiedValues: Record<string, json>,
  ): Promise<void> {
    await this.db
      .updateTable('WatchMonitor')
      .set({
        notifiedValuesJsonBlob: JSON.stringify(notifiedValues),
      })
      .where('name', '=', name)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .execute()
  }

  async recordFailure(
    name: string,
    attemptedAt: UnixTime,
    errorMessage: string,
  ): Promise<void> {
    const attemptedAtDate = UnixTime.toDate(attemptedAt)
    await this.db
      .insertInto('WatchMonitor')
      .values({
        name,
        timestamp: null,
        valuesJsonBlob: null,
        notifiedValuesJsonBlob: null,
        lastAttemptAt: attemptedAtDate,
        lastError: errorMessage,
      })
      .onConflict((cb) =>
        cb
          .columns(['name'])
          .doUpdateSet((eb) => ({
            lastAttemptAt: eb.ref('excluded.lastAttemptAt'),
            lastError: eb.ref('excluded.lastError'),
          }))
          .where((eb) =>
            eb.or([
              eb('WatchMonitor.lastAttemptAt', 'is', null),
              eb(
                'WatchMonitor.lastAttemptAt',
                '<=',
                eb.ref('excluded.lastAttemptAt'),
              ),
            ]),
          ),
      )
      .execute()
  }

  async getAll(): Promise<WatchMonitorRecord[]> {
    const rows = await this.db.selectFrom('WatchMonitor').selectAll().execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('WatchMonitor').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
