import { Logger } from '@l2beat/backend-tools'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { UpdateMonitorRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface UpdateMonitorRecord {
  projectName: string
  chainId: ChainId
  blockNumber: number
  timestamp: UnixTime
  discovery: DiscoveryOutput
  configHash: Hash256
  version: number
}

export class UpdateMonitorRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    this.autoWrap<CheckConvention<UpdateMonitorRepository>>(this)
  }

  async findLatest(
    name: string,
    chainId: ChainId,
  ): Promise<UpdateMonitorRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('update_monitor')
      .where({
        project_name: name,
        chain_id: +chainId,
      })
      .first()

    return row ? toRecord(row) : undefined
  }

  async addOrUpdate(record: UpdateMonitorRecord): Promise<string> {
    const knex = await this.knex()

    await knex('update_monitor')
      .insert(toRow(record))
      .onConflict(['project_name', 'chain_id'])
      .merge()

    return `${
      record.projectName
    } | block_number:  ${record.blockNumber.toString()}`
  }

  async getAll(): Promise<UpdateMonitorRecord[]> {
    const knex = await this.knex()
    const rows = await knex('update_monitor')

    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('update_monitor').delete()
  }
}

function toRecord(row: UpdateMonitorRow): UpdateMonitorRecord {
  return {
    projectName: row.project_name,
    chainId: ChainId(row.chain_id),
    blockNumber: row.block_number,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    discovery: row.discovery_json_blob as unknown as DiscoveryOutput,
    configHash: Hash256(row.config_hash),
    version: row.version,
  }
}

function toRow(record: UpdateMonitorRecord): UpdateMonitorRow {
  return {
    project_name: record.projectName,
    chain_id: +record.chainId,
    block_number: record.blockNumber,
    unix_timestamp: record.timestamp.toDate(),
    discovery_json_blob: JSON.stringify(record.discovery),
    config_hash: record.configHash.toString(),
    version: record.version,
  }
}
