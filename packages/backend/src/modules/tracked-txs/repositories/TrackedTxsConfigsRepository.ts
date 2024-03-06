import { Logger } from '@l2beat/backend-tools'
import {
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
import { TrackedTxsConfigEntry } from '../types/TrackedTxsConfig'
import { TrackedTxsConfigHash } from '../types/TrackedTxsConfigHash'

export interface TrackedTxsConfigRecord {
  projectId: ProjectId
  type: TrackedTxsConfigType
  subtype?: TrackedTxsConfigSubtype
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  lastSyncedTimestamp?: UnixTime
  debugInfo: string
  config_hash: TrackedTxsConfigHash
}

// TODO: add tests when finished
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
  // TODO: (tracked_tx)
  async addMany(
    records: TrackedTxsConfigEntry[],
    trx?: Knex.Transaction,
  ): Promise<TrackedTxsConfigHash[]> {
    const knex = await this.knex(trx)

    const insertedRows = await knex('tracked_txs_configs')
      .insert(records.map(toNewRow))
      .returning('id')

    return insertedRows.map((row) =>
      TrackedTxsConfigHash.unsafe(row.config_hash),
    )
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
    config_hashes: TrackedTxsConfigHash[],
    lastSyncedTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('tracked_txs_configs')
      .whereIn('config_hash', config_hashes)
      .update({ last_synced_timestamp: lastSyncedTimestamp.toDate() })
  }

  async setUntilTimestamp(
    config_hash: TrackedTxsConfigHash,
    untilTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('tracked_txs_configs')
      .where({ config_hash: config_hash.valueOf() })
      .update({ until_timestamp: untilTimestamp.toDate() })
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('tracked_txs_configs').delete()
  }

  async deleteMany(
    config_hashes: TrackedTxsConfigHash[],
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('tracked_txs_configs')
      .whereIn(
        'config_hash',
        config_hashes.map((h) => h.valueOf()),
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
    config_hash: TrackedTxsConfigHash.unsafe(row.config_hash),
    projectId: ProjectId(row.project_id),
    type: TrackedTxsConfigType(row.type),
    subtype: row.subtype ? TrackedTxsConfigSubtype(row.subtype) : undefined,
    sinceTimestamp: UnixTime.fromDate(row.since_timestamp),
    untilTimestamp,
    lastSyncedTimestamp,
    debugInfo: row.debug_info,
  }
}

function toNewRow(entry: TrackedTxsConfigEntry): TrackedTxsConfigRow {
  return {
    config_hash: entry.configHash.valueOf(),
    project_id: entry.projectId.toString(),
    type: entry.type,
    subtype: entry.subtype ?? null,
    since_timestamp: entry.sinceTimestamp.toDate(),
    until_timestamp: entry.untilTimestamp?.toDate() ?? null,
    last_synced_timestamp: null,
    debug_info: toDebugInfo(entry),
  }
}

function toDebugInfo(value: TrackedTxsConfigEntry): string {
  if (value.formula === 'transfer') {
    return `Transfer: ${value.from.toString()} -> ${value.to.toString()}`
  } else {
    return `Function call: ${value.address.toString()} : ${value.selector.toString()}`
  }
}
