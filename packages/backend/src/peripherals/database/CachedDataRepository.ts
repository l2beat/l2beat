import { Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'

import { ReportOutput } from '../../api/controllers/report/generateReportOutput'

const id = 0 // only one row should exist

export class CachedDataRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async getData(): Promise<ReportOutput | undefined> {
    const row = await this.knex('cached_data').where({ id }).first()
    return row?.data
  }

  async saveData(data: ReportOutput) {
    await this.knex('cached_data')
      .insert({
        id,
        unix_timestamp: UnixTime.now().toString(),
        data,
      })
      .onConflict(['id'])
      .merge()
  }

  async deleteAll() {
    await this.knex('cached_data').delete()
  }
}
