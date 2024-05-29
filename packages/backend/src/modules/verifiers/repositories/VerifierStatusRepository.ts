import { Logger } from '@l2beat/backend-tools'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { VerifierStatusRow } from 'knex/types/tables'
import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface VerifierStatusRecord {
  address: string
  chainId: ChainId
  lastUsed: UnixTime
  lastUpdated: UnixTime
}

export class VerifierStatusRepository extends BaseRepository {
  private readonly TABLE_NAME = 'verifier_status'

  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<VerifierStatusRepository>>(this)
  }

  async addOrUpdate(record: VerifierStatusRecord): Promise<string> {
    const knex = await this.knex()
    await knex(this.TABLE_NAME)
      .insert(toRow(record))
      .onConflict(['address', 'chain_id'])
      .merge()

    return `[${record.address}]: ${record.lastUsed}`
  }

  async findVerifierStatus(
    address: string,
    chainId: ChainId,
  ): Promise<VerifierStatusRecord | undefined> {
    const knex = await this.knex()

    const row = await knex(this.TABLE_NAME)
      .where({ address })
      .where({ chain_id: +chainId })
      .first()

    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<VerifierStatusRecord[]> {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex(this.TABLE_NAME).delete()
  }
}

function toRecord(row: VerifierStatusRow): VerifierStatusRecord {
  return {
    address: row.address,
    chainId: ChainId(row.chain_id),
    lastUsed: UnixTime.fromDate(row.last_used),
    lastUpdated: UnixTime.fromDate(row.last_updated),
  }
}

function toRow(record: VerifierStatusRecord): VerifierStatusRow {
  return {
    address: record.address,
    chain_id: +record.chainId,
    last_used: record.lastUsed.toDate(),
    last_updated: record.lastUpdated.toDate(),
  }
}
