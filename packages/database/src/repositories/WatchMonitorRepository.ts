import { sortDeep, type WatchDiff } from '@l2beat/discovery'
import { Hash256, type json, UnixTime } from '@l2beat/shared-pure'
import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { WatchMonitor } from '../kysely/generated/types'

export interface WatchPendingNotification {
  timestamp: UnixTime
  diff: WatchDiff[]
}

export interface WatchMonitorRecord {
  name: string
  timestamp: UnixTime | null
  values: Record<string, json> | null
  isPublic: boolean
  configHash: Hash256 | null
  pendingNotifications: WatchPendingNotification[]
  lastAttemptAt: UnixTime | null
  lastAttemptId: string | null
  lastError: string | null
}

export interface WatchObservation {
  name: string
  timestamp: UnixTime
  attemptAt: Date
  attemptId: string
  values: Record<string, json>
  isPublic: boolean
  configHash: Hash256
  pendingNotifications: WatchPendingNotification[]
}

export function toRecord(row: Selectable<WatchMonitor>): WatchMonitorRecord {
  return {
    name: row.name,
    timestamp: row.timestamp ? UnixTime.fromDate(row.timestamp) : null,
    values: canonicalizeValues(row.valuesJsonBlob),
    isPublic: row.isPublic,
    configHash: row.configHash !== null ? Hash256(row.configHash) : null,
    pendingNotifications: Array.isArray(row.pendingNotificationsJsonBlob)
      ? (row.pendingNotificationsJsonBlob as WatchPendingNotification[])
      : [],
    lastAttemptAt: row.lastAttemptAt
      ? UnixTime.fromDate(row.lastAttemptAt)
      : null,
    lastAttemptId: row.lastAttemptId,
    lastError: row.lastError,
  }
}

// PostgreSQL JSONB does not preserve object key order; re-sorting each watch
// key's value individually keeps array-of-objects comparisons deterministic
// without adding an extra level to the depth-8 template limit.
function canonicalizeValues(blob: unknown): Record<string, json> | null {
  if (blob === null || blob === undefined) {
    return null
  }
  const raw = blob as Record<string, json>
  const sorted: Record<string, json> = {}
  for (const key of Object.keys(raw).sort()) {
    const value = raw[key]
    if (value !== undefined) {
      sorted[key] = sortDeep(value)
    }
  }
  return sorted
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

  // Only advances the stored snapshot: a late or same-millisecond concurrent
  // attempt with a different attemptId cannot overwrite an already-persisted run.
  async upsertObservation(observation: WatchObservation): Promise<boolean> {
    const timestamp = UnixTime.toDate(observation.timestamp)
    const result = await this.db
      .insertInto('WatchMonitor')
      .values({
        name: observation.name,
        timestamp,
        valuesJsonBlob: JSON.stringify(observation.values),
        isPublic: observation.isPublic,
        configHash: observation.configHash.toString(),
        pendingNotificationsJsonBlob: JSON.stringify(
          observation.pendingNotifications,
        ),
        lastAttemptAt: observation.attemptAt,
        lastAttemptId: observation.attemptId,
        lastError: null,
      })
      .onConflict((cb) =>
        cb
          .columns(['name'])
          .doUpdateSet((eb) => ({
            timestamp: eb.ref('excluded.timestamp'),
            valuesJsonBlob: eb.ref('excluded.valuesJsonBlob'),
            isPublic: eb.ref('excluded.isPublic'),
            configHash: eb.ref('excluded.configHash'),
            pendingNotificationsJsonBlob: eb.ref(
              'excluded.pendingNotificationsJsonBlob',
            ),
            lastAttemptAt: eb.ref('excluded.lastAttemptAt'),
            lastAttemptId: eb.ref('excluded.lastAttemptId'),
            lastError: null,
          }))
          .where((eb) =>
            eb.and([
              eb.or([
                eb('WatchMonitor.timestamp', 'is', null),
                eb(
                  'WatchMonitor.timestamp',
                  '<=',
                  eb.ref('excluded.timestamp'),
                ),
              ]),
              eb.or([
                eb('WatchMonitor.lastAttemptAt', 'is', null),
                eb(
                  'WatchMonitor.lastAttemptAt',
                  '<',
                  eb.ref('excluded.lastAttemptAt'),
                ),
                eb.and([
                  eb(
                    'WatchMonitor.lastAttemptAt',
                    '=',
                    eb.ref('excluded.lastAttemptAt'),
                  ),
                  eb(
                    'WatchMonitor.lastAttemptId',
                    '=',
                    eb.ref('excluded.lastAttemptId'),
                  ),
                ]),
              ]),
            ]),
          ),
      )
      .executeTakeFirst()

    return Number(result.numInsertedOrUpdatedRows ?? 0) > 0
  }

  async updatePendingNotifications(
    name: string,
    attemptId: string,
    pendingNotifications: WatchPendingNotification[],
  ): Promise<boolean> {
    const result = await this.db
      .updateTable('WatchMonitor')
      .set({
        pendingNotificationsJsonBlob: JSON.stringify(pendingNotifications),
      })
      .where('name', '=', name)
      .where('lastAttemptId', '=', attemptId)
      .executeTakeFirst()

    return Number(result.numUpdatedRows ?? 0) > 0
  }

  async recordFailure(
    name: string,
    attemptAt: Date,
    attemptId: string,
    errorMessage: string,
  ): Promise<void> {
    await this.db
      .insertInto('WatchMonitor')
      .values({
        name,
        timestamp: null,
        valuesJsonBlob: null,
        isPublic: false,
        configHash: null,
        pendingNotificationsJsonBlob: null,
        lastAttemptAt: attemptAt,
        lastAttemptId: attemptId,
        lastError: errorMessage,
      })
      .onConflict((cb) =>
        cb
          .columns(['name'])
          .doUpdateSet((eb) => ({
            lastAttemptAt: eb.ref('excluded.lastAttemptAt'),
            lastAttemptId: eb.ref('excluded.lastAttemptId'),
            lastError: eb.ref('excluded.lastError'),
          }))
          .where((eb) =>
            eb.or([
              eb('WatchMonitor.lastAttemptAt', 'is', null),
              eb(
                'WatchMonitor.lastAttemptAt',
                '<',
                eb.ref('excluded.lastAttemptAt'),
              ),
              eb.and([
                eb(
                  'WatchMonitor.lastAttemptAt',
                  '=',
                  eb.ref('excluded.lastAttemptAt'),
                ),
                eb(
                  'WatchMonitor.lastAttemptId',
                  '=',
                  eb.ref('excluded.lastAttemptId'),
                ),
              ]),
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
