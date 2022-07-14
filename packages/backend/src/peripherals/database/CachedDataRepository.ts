import { ApiMain, Logger, UnixTime } from '@l2beat/common'

import { ReportOutput } from '../../api/controllers/report/generateReportOutput'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

const DATA_ID = 0
const MAIN_ID = 1

export class CachedDataRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.getData = this.wrapFind(this.getData)
    this.saveData = this.wrapAdd(this.saveData)
    this.getMain = this.wrapFind(this.getMain)
    this.saveMain = this.wrapAdd(this.saveMain)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getData(): Promise<ReportOutput | undefined> {
    const knex = await this.knex()
    const row = await knex('cached_data').where({ id: DATA_ID }).first()
    return row?.data as ReportOutput
  }

  async getMain(): Promise<ApiMain | undefined> {
    const knex = await this.knex()
    const row = await knex('cached_data').where({ id: MAIN_ID }).first()
    if (!row) {
      return undefined
    }
    return ApiMain.parse(row.data)
  }

  async saveData(data: ReportOutput) {
    const knex = await this.knex()
    await knex('cached_data')
      .insert({
        id: DATA_ID,
        unix_timestamp: UnixTime.now().toString(),
        data,
      })
      .onConflict(['id'])
      .merge()
    return DATA_ID
  }

  async saveMain(data: ApiMain) {
    const knex = await this.knex()
    await knex('cached_data')
      .insert({
        id: MAIN_ID,
        unix_timestamp: UnixTime.now().toString(),
        data,
      })
      .onConflict(['id'])
      .merge()
    return MAIN_ID
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('cached_data').delete()
  }
}
