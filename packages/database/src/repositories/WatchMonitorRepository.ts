import { sortDeep, type WatchDiff } from '@l2beat/discovery'
import { Hash256, type json, UnixTime } from '@l2beat/shared-pure'
import { type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { WatchMonitor } from '../kysely/generated/types'

export interface WatchPendingNotification {
  id: string
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
  lastAttemptConfigHash: Hash256 | null
  lastError: string | null
}

export interface WatchObservation {
  name: string
  timestamp: UnixTime
  attemptAt: Date
  attemptId: string
  expectedLastAttemptId: string | null
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
    lastAttemptConfigHash:
      row.lastAttemptConfigHash !== null
        ? Hash256(row.lastAttemptConfigHash)
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

  // Optimistic CAS on expectedLastAttemptId plus monotonic attempt ordering:
  // prevents a newer attempt from silently overwriting an observation/queue
  // persisted by another attempt between read and write.
  async upsertObservation(observation: WatchObservation): Promise<boolean> {
    const timestamp = UnixTime.toDate(observation.timestamp)
    const configHash = observation.configHash.toString()
    const result = await this.db
      .insertInto('WatchMonitor')
      .values({
        name: observation.name,
        timestamp,
        valuesJsonBlob: JSON.stringify(observation.values),
        isPublic: observation.isPublic,
        configHash,
        pendingNotificationsJsonBlob: JSON.stringify(
          observation.pendingNotifications,
        ),
        lastAttemptAt: observation.attemptAt,
        lastAttemptId: observation.attemptId,
        lastAttemptConfigHash: configHash,
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
            lastAttemptConfigHash: eb.ref('excluded.lastAttemptConfigHash'),
            lastError: null,
          }))
          .where((eb) =>
            eb.and([
              observation.expectedLastAttemptId === null
                ? eb('WatchMonitor.lastAttemptId', 'is', null)
                : eb(
                    'WatchMonitor.lastAttemptId',
                    '=',
                    observation.expectedLastAttemptId,
                  ),
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

  // Monotonic per-item removal so concurrent drains can never resurrect an
  // already-acknowledged notification or drop a newly appended one.
  async acknowledgePendingNotification(
    name: string,
    notificationId: string,
  ): Promise<void> {
    await sql`
      UPDATE "WatchMonitor"
      SET "pendingNotificationsJsonBlob" = COALESCE(
        (
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements("pendingNotificationsJsonBlob") AS elem
          WHERE elem->>'id' <> ${notificationId}
        ),
        '[]'::jsonb
      )
      WHERE "name" = ${name}
        AND "pendingNotificationsJsonBlob" IS NOT NULL
        AND jsonb_typeof("pendingNotificationsJsonBlob") = 'array'
    `.execute(this.db)
  }

  async recordFailure(
    name: string,
    attemptAt: Date,
    attemptId: string,
    errorMessage: string,
    configHash: Hash256 | null = null,
  ): Promise<void> {
    const attemptConfigHash = configHash?.toString() ?? null
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
        lastAttemptConfigHash: attemptConfigHash,
        lastError: errorMessage,
      })
      .onConflict((cb) =>
        cb
          .columns(['name'])
          .doUpdateSet((eb) => ({
            lastAttemptAt: eb.ref('excluded.lastAttemptAt'),
            lastAttemptId: eb.ref('excluded.lastAttemptId'),
            lastAttemptConfigHash: eb.ref('excluded.lastAttemptConfigHash'),
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
