import { Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'

import { ReportOutput } from '../../api/controllers/report/generateReportOutput'

export class CachedDataRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async getData(): Promise<ReportOutput | undefined> {
    const row = await this.knex('cached_data').where({ id: 0 }).first()

    console.log(typeof row?.data)

    return row ? row.data : undefined
  }

  async saveData(data: ReportOutput) {
    await this.knex('cached_data')
      .insert({
        id: 0,
        unix_timestamp: UnixTime.now().toString(),
        data: data,
      })
      .onConflict(['id'])
      .merge()
  }

  async deleteAll() {
    await this.knex('cached_data').delete()
  }
}
