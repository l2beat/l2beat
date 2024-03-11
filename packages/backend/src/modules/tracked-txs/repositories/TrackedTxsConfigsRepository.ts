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
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { TrackedTxsId } from '../types/TrackedTxsId'

export interface TrackedTxsConfigRecord {
  id: TrackedTxsId
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
    records: TrackedTxConfigEntry[],
    trx?: Knex.Transaction,
  ): Promise<TrackedTxsId[]> {
    const knex = await this.knex(trx)

    const insertedRows = await knex('tracked_txs_configs')
      .insert(records.flatMap(toNewRow))
      .returning('id')

    return insertedRows
      .map((row) => (row.id ? TrackedTxsId.unsafe(row.id) : undefined))
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
    trackedTxsIds: TrackedTxsId[],
    lastSyncedTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('tracked_txs_configs')
      .whereIn('id', trackedTxsIds)
      .update({ last_synced_timestamp: lastSyncedTimestamp.toDate() })
  }

  async setUntilTimestamp(
    trackedTxsId: TrackedTxsId,
    untilTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('tracked_txs_configs')
      .where({ id: trackedTxsId.valueOf() })
      .update({ until_timestamp: untilTimestamp.toDate() })
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('tracked_txs_configs').delete()
  }

  async deleteMany(trackedTxsIds: TrackedTxsId[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    return knex('tracked_txs_configs')
      .whereIn(
        'id',
        trackedTxsIds.map((id) => id.valueOf()),
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
    id: TrackedTxsId.unsafe(row.id),
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

export function toNewRow(entry: TrackedTxConfigEntry): TrackedTxsConfigRow[] {
  return entry.uses.map((use) => ({
    id: use.id.toString(),
    project_id: entry.projectId.toString(),
    type: use.type,
    subtype: use.subType,
    since_timestamp: entry.sinceTimestamp.toDate(),
    until_timestamp: entry.untilTimestamp?.toDate() ?? null,
    last_synced_timestamp: null,
    debug_info: toDebugInfo(entry),
  }))
}

function toDebugInfo(value: TrackedTxConfigEntry): string {
  if (value.formula === 'transfer') {
    return `Transfer: ${value.from.toString()} -> ${value.to.toString()}`
  } else {
    return `Function call: ${value.address.toString()} : ${value.selector.toString()}`
  }
}
