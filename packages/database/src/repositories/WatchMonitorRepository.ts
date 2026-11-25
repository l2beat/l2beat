import { sortDeep, type WatchDiff } from '@l2beat/discovery'
import { Hash256, type json, UnixTime } from '@l2beat/shared-pure'
import { type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { WatchMonitor } from '../kysely/generated/types'

export interface WatchPendingNotification {
  id: string
  timestamp: UnixTime
  diff: WatchDiff[]
  claimedBy?: string
  claimedAt?: number
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
  newNotification: WatchPendingNotification | null
  maxPendingNotifications: number
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

  // Optimistic CAS on expectedLastAttemptId plus monotonic attempt ordering,
  // and atomic SQL append for newNotification: prevents a concurrent attempt
  // from either overwriting a newer observation or restoring an already
  // acknowledged/claimed notification from a stale read.
  async upsertObservation(observation: WatchObservation): Promise<boolean> {
    const timestamp = UnixTime.toDate(observation.timestamp)
    const configHash = observation.configHash.toString()
    const initialQueue =
      observation.newNotification !== null ? [observation.newNotification] : []
    const result = await this.db
      .insertInto('WatchMonitor')
      .values({
        name: observation.name,
        timestamp,
        valuesJsonBlob: JSON.stringify(observation.values),
        isPublic: observation.isPublic,
        configHash,
        pendingNotificationsJsonBlob: JSON.stringify(initialQueue),
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
            ...(observation.newNotification !== null
              ? {
                  // Keep an actively claimed head outside backlog eviction so
                  // capacity capping never drops an in-flight alert or lets a
                  // second worker claim the next alert concurrently.
                  pendingNotificationsJsonBlob: sql<unknown>`(
                    SELECT COALESCE(jsonb_agg(elem ORDER BY ord), '[]'::jsonb)
                    FROM (
                      WITH items AS (
                        SELECT elem, ord
                        FROM jsonb_array_elements(
                          (CASE
                            WHEN jsonb_typeof("WatchMonitor"."pendingNotificationsJsonBlob") = 'array'
                            THEN "WatchMonitor"."pendingNotificationsJsonBlob"
                            ELSE '[]'::jsonb
                          END) || ${JSON.stringify([observation.newNotification])}::jsonb
                        ) WITH ORDINALITY AS t(elem, ord)
                      ),
                      claimed_head AS (
                        SELECT elem, ord
                        FROM items
                        WHERE ord = 1 AND elem ? 'claimedBy'
                      ),
                      tail AS (
                        SELECT elem, ord
                        FROM items
                        WHERE NOT (ord = 1 AND elem ? 'claimedBy')
                        ORDER BY ord DESC
                        LIMIT GREATEST(
                          ${observation.maxPendingNotifications} - (SELECT COUNT(*)::int FROM claimed_head),
                          0
                        )
                      )
                      SELECT elem, ord FROM claimed_head
                      UNION ALL
                      SELECT elem, ord FROM tail
                    ) sub
                  )`,
                }
              : {}),
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

  // Claims the head queued notification under a row lock so at most one active
  // delivery owner sends it at a time while preserving FIFO order.
  async claimNextPendingNotification(
    name: string,
    ownerId: string,
    nowMs: number,
    leaseMs: number,
  ): Promise<WatchPendingNotification | undefined> {
    return await this.transaction(async () => {
      const row = await this.db
        .selectFrom('WatchMonitor')
        .select('pendingNotificationsJsonBlob')
        .where('name', '=', name)
        .forUpdate()
        .executeTakeFirst()
      if (!row || !Array.isArray(row.pendingNotificationsJsonBlob)) {
        return undefined
      }
      const queue =
        row.pendingNotificationsJsonBlob as WatchPendingNotification[]
      const head = queue[0]
      if (head === undefined) {
        return undefined
      }
      if (
        head.claimedBy !== undefined &&
        head.claimedAt !== undefined &&
        nowMs - head.claimedAt < leaseMs
      ) {
        return undefined
      }
      const claimed: WatchPendingNotification = {
        id: head.id,
        timestamp: head.timestamp,
        diff: head.diff,
        claimedBy: ownerId,
        claimedAt: nowMs,
      }
      const updated = [claimed, ...queue.slice(1)]
      await this.db
        .updateTable('WatchMonitor')
        .set({ pendingNotificationsJsonBlob: JSON.stringify(updated) })
        .where('name', '=', name)
        .execute()
      return claimed
    })
  }

  async releasePendingNotificationClaim(
    name: string,
    notificationId: string,
    ownerId: string,
  ): Promise<void> {
    await this.transaction(async () => {
      const row = await this.db
        .selectFrom('WatchMonitor')
        .select('pendingNotificationsJsonBlob')
        .where('name', '=', name)
        .forUpdate()
        .executeTakeFirst()
      if (!row || !Array.isArray(row.pendingNotificationsJsonBlob)) {
        return
      }
      const queue =
        row.pendingNotificationsJsonBlob as WatchPendingNotification[]
      let changed = false
      const updated = queue.map((item) => {
        if (item.id === notificationId && item.claimedBy === ownerId) {
          changed = true
          return { id: item.id, timestamp: item.timestamp, diff: item.diff }
        }
        return item
      })
      if (changed) {
        await this.db
          .updateTable('WatchMonitor')
          .set({ pendingNotificationsJsonBlob: JSON.stringify(updated) })
          .where('name', '=', name)
          .execute()
      }
    })
  }

  // Owner-checked monotonic removal preserving FIFO order: only the active
  // claim owner can complete and remove the notification, so a late finisher
  // after lease takeover cannot ack another owner's active delivery.
  async acknowledgePendingNotification(
    name: string,
    notificationId: string,
    ownerId: string,
  ): Promise<boolean> {
    return await this.transaction(async () => {
      const row = await this.db
        .selectFrom('WatchMonitor')
        .select('pendingNotificationsJsonBlob')
        .where('name', '=', name)
        .forUpdate()
        .executeTakeFirst()
      if (!row || !Array.isArray(row.pendingNotificationsJsonBlob)) {
        return false
      }
      const queue =
        row.pendingNotificationsJsonBlob as WatchPendingNotification[]
      const matched = queue.some(
        (item) => item.id === notificationId && item.claimedBy === ownerId,
      )
      if (!matched) {
        return false
      }
      const updated = queue.filter(
        (item) => !(item.id === notificationId && item.claimedBy === ownerId),
      )
      await this.db
        .updateTable('WatchMonitor')
        .set({ pendingNotificationsJsonBlob: JSON.stringify(updated) })
        .where('name', '=', name)
        .execute()
      return true
    })
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
