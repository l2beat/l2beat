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
  lastError: string | null
}

export interface WatchObservation {
  name: string
  timestamp: UnixTime
  attemptAt: UnixTime
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

  // Only advances the stored snapshot: a late timed-out run cannot regress a
  // newer observation or attempt already persisted by a subsequent tick.
  async upsertObservation(observation: WatchObservation): Promise<boolean> {
    const timestamp = UnixTime.toDate(observation.timestamp)
    const attemptAt = UnixTime.toDate(observation.attemptAt)
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
        lastAttemptAt: attemptAt,
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
                  '<=',
                  eb.ref('excluded.lastAttemptAt'),
                ),
              ]),
            ]),
          ),
      )
      .executeTakeFirst()

    return Number(result.numInsertedOrUpdatedRows ?? 0) > 0
  }

  async updatePendingNotifications(
    name: string,
    attemptAt: UnixTime,
    pendingNotifications: WatchPendingNotification[],
  ): Promise<void> {
    await this.db
      .updateTable('WatchMonitor')
      .set({
        pendingNotificationsJsonBlob: JSON.stringify(pendingNotifications),
      })
      .where('name', '=', name)
      .where('lastAttemptAt', '=', UnixTime.toDate(attemptAt))
      .execute()
  }

  async recordFailure(
    name: string,
    attemptAt: UnixTime,
    errorMessage: string,
  ): Promise<void> {
    const attemptAtDate = UnixTime.toDate(attemptAt)
    await this.db
      .insertInto('WatchMonitor')
      .values({
        name,
        timestamp: null,
        valuesJsonBlob: null,
        isPublic: false,
        configHash: null,
        pendingNotificationsJsonBlob: null,
        lastAttemptAt: attemptAtDate,
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
