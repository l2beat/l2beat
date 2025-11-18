import type { Insertable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { Chain } from '../kysely/generated/types'

export type ChainApi = {
  callsPerMinute?: number
} & (
  | RpcChainApi
  | EtherscanChainApi
  | BlockscoutChainApi
  | BlockscoutV2ChainApi
  | RoutescanChainApi
)

type EtherscanChainApi = {
  type: 'etherscan'
}

type BlockscoutChainApi = {
  type: 'blockscout'
  url: string
}

type BlockscoutV2ChainApi = {
  type: 'blockscoutV2'
  url: string
}

type RoutescanChainApi = {
  type: 'routescan'
  url: string
}

type RpcChainApi = {
  type: 'rpc'
  url: string
}

export type ChainRecord = {
  name: string
  chainId: number
  explorerUrl: string | null
  aliases: string[] | null
  apis: ChainApi[] | null
}

const toRecord = (record: Chain): ChainRecord => {
  return {
    ...record,
    aliases: record.aliases as string[] | null,
    apis: record.apis as ChainApi[] | null,
  }
}

const toRow = (record: ChainRecord): Insertable<Chain> => {
  return {
    ...record,
    aliases: record.aliases !== null ? JSON.stringify(record.aliases) : null,
    apis: record.apis !== null ? JSON.stringify(record.apis) : null,
  }
}

export type ChainUpdateable = Partial<Omit<ChainRecord, 'name'>> & {
  name: string
}

const toUpdateRow = (record: ChainUpdateable): Partial<Insertable<Chain>> => {
  return {
    name: record.name,
    chainId: record.chainId,
    explorerUrl: record.explorerUrl,
    aliases: record.aliases !== null ? JSON.stringify(record.aliases) : null,
    apis: record.apis !== null ? JSON.stringify(record.apis) : null,
  }
}

export class ChainRepository extends BaseRepository {
  async insert(record: ChainRecord): Promise<void> {
    await this.db.insertInto('Chain').values(toRow(record)).execute()
  }

  async insertMany(records: ChainRecord[]): Promise<void> {
    if (records.length === 0) return
    await this.db.insertInto('Chain').values(records.map(toRow)).execute()
  }

  async getAll(): Promise<ChainRecord[]> {
    const rows = await this.db.selectFrom('Chain').selectAll().execute()
    return rows.map(toRecord)
  }

  async findByName(name: string): Promise<ChainRecord | undefined> {
    const row = await this.db
      .selectFrom('Chain')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirst()
    return row ? toRecord(row) : undefined
  }

  async updateByName(name: string, patch: ChainUpdateable): Promise<number> {
    const updateRow = toUpdateRow(patch)

    const result = await this.db
      .updateTable('Chain')
      .set(updateRow)
      .where('name', '=', name)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async deleteByName(name: string): Promise<number> {
    const result = await this.db
      .deleteFrom('Chain')
      .where('name', '=', name)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Chain').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
