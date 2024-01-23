import { Logger } from '@l2beat/backend-tools'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { DiscoveryHistoryRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface DiscoveryHistoryRecord {
  projectName: string
  chainId: ChainId
  blockNumber: number
  timestamp: UnixTime
  discovery: DiscoveryOutput
  configHash: Hash256
  version: number
}

export class DiscoveryHistoryRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    this.autoWrap<CheckConvention<DiscoveryHistoryRepository>>(this)
  }

  async findLatest(
    name: string,
    chainId: ChainId,
  ): Promise<DiscoveryHistoryRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('daily_discovery')
      .where({
        project_name: name,
        chain_id: +chainId,
      })
      .orderBy('unix_timestamp', 'desc')
      .first()

    return row ? toRecord(row) : undefined
  }

  async getTimestamps(
    projectName: string,
    chainId: ChainId,
  ): Promise<UnixTime[]> {
    const knex = await this.knex()

    const rows = await knex('daily_discovery').select('unix_timestamp').where({
      project_name: projectName,
      chain_id: +chainId,
    })

    return rows.map((t) => UnixTime.fromDate(t.unix_timestamp))
  }

  async addOrUpdate(record: DiscoveryHistoryRecord): Promise<string> {
    const knex = await this.knex()

    await knex('daily_discovery')
      .insert(toRow(record))
      .onConflict(['project_name', 'chain_id', 'unix_timestamp'])
      .merge()

    return `${
      record.projectName
    } | block_number:  ${record.blockNumber.toString()}`
  }

  async getAvailableProjects(): Promise<
    Pick<DiscoveryHistoryRecord, 'projectName' | 'chainId'>[]
  > {
    const knex = await this.knex()

    const rows = await knex('daily_discovery')
      .select('project_name', 'chain_id')
      .groupBy('project_name', 'chain_id')

    return rows.map((row) => ({
      projectName: row.project_name,
      chainId: ChainId(row.chain_id),
    }))
  }

  async getProject(
    projectName: string,
    chainId: ChainId,
  ): Promise<DiscoveryHistoryRecord[]> {
    const knex = await this.knex()

    const rows = await knex('daily_discovery').where({
      project_name: projectName,
      chain_id: +chainId,
    })

    return rows.map(toRecord)
  }

  async getAll(): Promise<DiscoveryHistoryRecord[]> {
    const knex = await this.knex()
    const rows = await knex('daily_discovery')

    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('daily_discovery').delete()
  }
}

function toRecord(row: DiscoveryHistoryRow): DiscoveryHistoryRecord {
  const result = {
    projectName: row.project_name,
    chainId: ChainId(row.chain_id),
    blockNumber: row.block_number,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    discovery: row.discovery_json_blob as unknown as DiscoveryOutput,
    configHash: Hash256(row.config_hash),
    version: row.version,
  }

  // NOTE(radomski): This has to be here, otherwise the risk of exposing our
  // API keys goes way up. Putting this in the database gives us the highest
  // chance of being secure.
  result.discovery.contracts.forEach((c) => (c.errors = undefined))

  return result
}

function toRow(record: DiscoveryHistoryRecord): DiscoveryHistoryRow {
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
