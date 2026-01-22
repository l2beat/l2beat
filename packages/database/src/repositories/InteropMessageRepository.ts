import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropMessage } from '../kysely/generated/types'

export interface InteropMessageRecord {
  plugin: string
  messageId: string
  type: string
  app: string
  duration: number | undefined
  timestamp: UnixTime
  srcTime: UnixTime | undefined
  srcChain: string | undefined
  srcTxHash: string | undefined
  srcLogIndex: number | undefined
  srcEventId: string | undefined
  dstTime: UnixTime | undefined
  dstChain: string | undefined
  dstTxHash: string | undefined
  dstLogIndex: number | undefined
  dstEventId: string | undefined
}

export function toRecord(
  row: Selectable<InteropMessage>,
): InteropMessageRecord {
  return {
    plugin: row.plugin,
    messageId: row.messageId,
    type: row.type,
    app: row.app,
    duration: row.duration ?? undefined,
    timestamp: UnixTime.fromDate(row.timestamp),
    srcTime: row.srcTime !== null ? UnixTime.fromDate(row.srcTime) : undefined,
    srcChain: row.srcChain ?? undefined,
    srcTxHash: row.srcTxHash?.toLowerCase() ?? undefined,
    srcLogIndex: row.srcLogIndex ?? undefined,
    srcEventId: row.srcEventId ?? undefined,
    dstTime: row.dstTime !== null ? UnixTime.fromDate(row.dstTime) : undefined,
    dstChain: row.dstChain ?? undefined,
    dstTxHash: row.dstTxHash?.toLowerCase() ?? undefined,
    dstLogIndex: row.dstLogIndex ?? undefined,
    dstEventId: row.dstEventId ?? undefined,
  }
}

export function toRow(
  record: InteropMessageRecord,
): Insertable<InteropMessage> {
  return {
    plugin: record.plugin,
    messageId: record.messageId,
    type: record.type,
    app: record.app,
    duration: record.duration,
    timestamp: UnixTime.toDate(record.timestamp),
    srcTime:
      record.srcTime !== undefined ? UnixTime.toDate(record.srcTime) : null,
    srcChain: record.srcChain,
    srcTxHash: record.srcTxHash,
    srcLogIndex: record.srcLogIndex,
    srcEventId: record.srcEventId,
    dstTime:
      record.dstTime !== undefined ? UnixTime.toDate(record.dstTime) : null,
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash,
    dstLogIndex: record.dstLogIndex,
    dstEventId: record.dstEventId,
  }
}

export interface InteropMessageStatsRecord {
  plugin: string
  type: string
  count: number
  avgDuration: number
  knownAppCount: number
}

export interface InteropMessageDetailedStatsRecord {
  plugin: string
  type: string
  srcChain: string
  dstChain: string
  count: number
  avgDuration: number
}

export interface InteropMessageUniqueAppsRecord {
  plugin: string
  apps: string[]
}

export class InteropMessageRepository extends BaseRepository {
  async insertMany(records: InteropMessageRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db.insertInto('InteropMessage').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<InteropMessageRecord[]> {
    const rows = await this.db
      .selectFrom('InteropMessage')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByType(
    type: string,
    options: {
      srcChain?: string
      dstChain?: string
    } = {},
  ): Promise<InteropMessageRecord[]> {
    let query = this.db.selectFrom('InteropMessage').where('type', '=', type)

    if (options.srcChain !== undefined) {
      query = query.where('srcChain', '=', options.srcChain)
    }

    if (options.dstChain !== undefined) {
      query = query.where('dstChain', '=', options.dstChain)
    }

    const rows = await query.orderBy('timestamp', 'desc').selectAll().execute()

    return rows.map(toRecord)
  }

  async getStats(): Promise<InteropMessageStatsRecord[]> {
    const overallStats = await this.db
      .selectFrom('InteropMessage')
      .select((eb) => [
        'plugin',
        'type',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('avgDuration'),
        eb.fn
          .count(
            eb
              .case()
              .when(
                eb.and([
                  eb('app', '!=', ''),
                  eb('app', '!=', 'unknown'),
                  eb('app', 'is not', null),
                ]),
              )
              .then(1)
              .end(),
          )
          .as('knownAppCount'),
      ])
      .groupBy(['plugin', 'type'])
      .execute()

    return overallStats.map((overall) => ({
      plugin: overall.plugin,
      type: overall.type,
      count: Number(overall.count),
      avgDuration: Number(overall.avgDuration),
      knownAppCount: Number(overall.knownAppCount),
    }))
  }

  async getExistingItems(
    items: { srcTxHash: string; dstTxHash: string }[],
  ): Promise<InteropMessageRecord[]> {
    if (items.length === 0) return []

    const srcHashes = items.map((x) => x.srcTxHash.toLowerCase())
    const dstHashes = items.map((x) => x.dstTxHash.toLowerCase())
    const rows = await this.db
      .selectFrom('InteropMessage')
      .selectAll()
      .where('srcTxHash', 'in', srcHashes)
      .where('dstTxHash', 'in', dstHashes)
      .execute()
    return rows.map(toRecord)
  }

  async getDetailedStats(): Promise<InteropMessageDetailedStatsRecord[]> {
    const chainStats = await this.db
      .selectFrom('InteropMessage')
      .select((eb) => [
        'plugin',
        'type',
        'srcChain',
        'dstChain',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('avgDuration'),
      ])
      .where('srcChain', 'is not', null)
      .where('dstChain', 'is not', null)
      .groupBy(['plugin', 'type', 'srcChain', 'dstChain'])
      .execute()

    return chainStats.map((chain) => {
      assert(chain.srcChain && chain.dstChain)
      return {
        plugin: chain.plugin,
        type: chain.type,
        srcChain: chain.srcChain,
        dstChain: chain.dstChain,
        count: Number(chain.count),
        avgDuration: Number(chain.avgDuration),
      }
    })
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropMessage')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('InteropMessage').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteForPlugin(plugin: string): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropMessage')
      .where('plugin', '=', plugin)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getUniqueAppsPerPlugin(): Promise<InteropMessageUniqueAppsRecord[]> {
    const rows = await this.db
      .selectFrom('InteropMessage')
      .select(['plugin', 'app'])
      .distinct()
      .where('app', '!=', '')
      .where('app', '!=', 'unknown')
      .where('app', 'is not', null)
      .execute()

    const grouped = new Map<string, string[]>()

    for (const row of rows) {
      const apps = grouped.get(row.plugin) ?? []
      apps.push(row.app)
      grouped.set(row.plugin, apps)
    }

    return Array.from(grouped.entries()).map(([plugin, apps]) => ({
      plugin,
      apps,
    }))
  }
}
