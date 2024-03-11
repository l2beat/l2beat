import { Logger } from '@l2beat/backend-tools'
import {
  notUndefined,
  ProjectId,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { TrackedTxsConfigRow } from 'knex/types/tables'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'
import { TrackedTxId } from '../types/TrackedTxId'
import {
  TrackedTxConfigEntry,
  TrackedTxUseWithId,
} from '../types/TrackedTxsConfig'

export interface TrackedTxsConfigRecord {
  id: TrackedTxId
  projectId: ProjectId
  type: TrackedTxsConfigType
  subtype?: TrackedTxsConfigSubtype
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  lastSyncedTimestamp?: UnixTime
  debugInfo: string
}

export class TrackedTxsConfigsRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<TrackedTxsConfigsRepository>>(this)
  }

  async getAll(): Promise<TrackedTxsConfigRecord[]> {
    const knex = await this.knex()
    const rows = await knex('tracked_txs_configs')
    return rows.map(toRecord)
  }

  async addMany(
    records: TrackedTxsConfigRecord[],
    trx?: Knex.Transaction,
  ): Promise<TrackedTxId[]> {
    const knex = await this.knex(trx)

    const insertedRows = await knex('tracked_txs_configs')
      .insert(records.map(toRow))
      .returning('id')

    return insertedRows
      .map((row) => (row.id ? TrackedTxId.unsafe(row.id) : undefined))
      .filter(notUndefined)
  }

  // TODO: (tracked_tx) to add after adding config_hash to liveness table
  // async findUnusedConfigurationsIds(): Promise<TrackedTxsConfigHash[]> {
  //   const knex = await this.knex()
  //   const rows = (await knex('tracked_txs_configs as c')
  //     .select('c.config_hash')
  //     .leftJoin('liveness as l', 'c.config_hash', 'l.config_hash')
  //     .groupBy('c.config_hash')
  //     .havingRaw('count(l.config_hash) = 0')) as { config_hash: string }[]

  //   return rows.map((row) => TrackedTxsConfigHash.unsafe(row.config_hash))
  // }

  async setLastSyncedTimestamp(
    trackedTxIds: TrackedTxId[],
    lastSyncedTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('tracked_txs_configs')
      .whereIn('id', trackedTxIds)
      .update({ last_synced_timestamp: lastSyncedTimestamp.toDate() })
  }

  async setUntilTimestamp(
    trackedTxId: TrackedTxId,
    untilTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('tracked_txs_configs')
      .where({ id: trackedTxId.valueOf() })
      .update({ until_timestamp: untilTimestamp.toDate() })
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('tracked_txs_configs').delete()
  }

  async deleteMany(trackedTxIds: TrackedTxId[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    return knex('tracked_txs_configs')
      .whereIn(
        'id',
        trackedTxIds.map((id) => id.valueOf()),
      )
      .delete()
  }
}

function toRecord(row: TrackedTxsConfigRow): TrackedTxsConfigRecord {
  const untilTimestamp = row.until_timestamp
    ? UnixTime.fromDate(row.until_timestamp)
    : undefined

  const lastSyncedTimestamp = row.last_synced_timestamp
    ? UnixTime.fromDate(row.last_synced_timestamp)
    : undefined

  return {
    id: TrackedTxId.unsafe(row.id),
    projectId: ProjectId(row.project_id),
    type: TrackedTxsConfigType.parse(row.type),
    subtype: row.subtype
      ? TrackedTxsConfigSubtype.parse(row.subtype)
      : undefined,
    sinceTimestamp: UnixTime.fromDate(row.since_timestamp),
    untilTimestamp,
    lastSyncedTimestamp,
    debugInfo: row.debug_info,
  }
}

export function trackedTxConfigEntryToRow(
  entry: TrackedTxConfigEntry,
  entryUse: TrackedTxUseWithId,
) {
  return {
    id: entryUse.id,
    debugInfo: toDebugInfo(entry),
    projectId: entry.projectId,
    type: entryUse.type,
    subtype: entryUse.subType,
    sinceTimestamp: entry.sinceTimestamp,
    untilTimestamp: entry.untilTimestamp,
  }
}

function toRow(entry: TrackedTxsConfigRecord): TrackedTxsConfigRow {
  return {
    id: entry.id.toString(),
    project_id: entry.projectId.toString(),
    type: entry.type,
    subtype: entry.subtype ?? null,
    since_timestamp: entry.sinceTimestamp.toDate(),
    until_timestamp: entry.untilTimestamp?.toDate() ?? null,
    last_synced_timestamp: null,
    debug_info: entry.debugInfo,
  }
}

function toDebugInfo(value: TrackedTxConfigEntry): string {
  if (value.formula === 'transfer') {
    return `Transfer: ${value.from.toString()} -> ${value.to.toString()}`
  } else {
    return `Function call: ${value.address.toString()} : ${value.selector.toString()}`
  }
}
