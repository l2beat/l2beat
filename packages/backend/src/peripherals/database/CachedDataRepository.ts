import { Logger, UnixTime } from '@l2beat/common'

import { ReportOutput } from '../../api/controllers/report/generateReportOutput'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

const id = 0 // only one row should exist

export class CachedDataRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.getData = this.wrapFind(this.getData)
    this.saveData = this.wrapAdd(this.saveData)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getData(): Promise<ReportOutput | undefined> {
    const knex = await this.knex()
    const row = await knex('cached_data').where({ id }).first()
    return row?.data
  }

  async saveData(data: ReportOutput) {
    const knex = await this.knex()
    await knex('cached_data')
      .insert({
        id,
        unix_timestamp: UnixTime.now().toString(),
        data,
      })
      .onConflict(['id'])
      .merge()
    return id
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('cached_data').delete()
  }
}
