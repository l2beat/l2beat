import { DiscoveryOutput, Hash256, Logger, UnixTime } from '@l2beat/shared'
import { DiscoveryWatcherRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface DiscoveryWatcherRecord {
  projectName: string
  blockNumber: number
  timestamp: UnixTime
  discovery: DiscoveryOutput
  configHash: Hash256
}
export class DiscoveryWatcherRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    this.autoWrap<CheckConvention<DiscoveryWatcherRepository>>(this)
  }

  async findLatest(name: string): Promise<DiscoveryWatcherRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('discovery_watcher')
      .where('project_name', name)
      .first()

    return row ? toRecord(row) : undefined
  }

  async addOrUpdate(record: DiscoveryWatcherRecord): Promise<string> {
    const knex = await this.knex()
    const row = toRow(record)

    await knex('discovery_watcher')
      .insert(row)
      .onConflict('project_name')
      .merge()

    return `${
      record.projectName
    } | block_number:  ${record.blockNumber.toString()}`
  }

  async getAll(): Promise<DiscoveryWatcherRecord[]> {
    const knex = await this.knex()
    const rows = await knex('discovery_watcher')

    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('discovery_watcher').delete()
  }
}

function toRecord(row: DiscoveryWatcherRow): DiscoveryWatcherRecord {
  return {
    projectName: row.project_name,
    blockNumber: row.block_number,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    discovery: row.discovery_json_blob as unknown as DiscoveryOutput,
    configHash: Hash256(row.config_hash),
  }
}

function toRow(record: DiscoveryWatcherRecord): DiscoveryWatcherRow {
  return {
    project_name: record.projectName,
    block_number: record.blockNumber,
    unix_timestamp: record.timestamp.toDate(),
    discovery_json_blob: JSON.stringify(record.discovery),
    config_hash: record.configHash.toString(),
  }
}
