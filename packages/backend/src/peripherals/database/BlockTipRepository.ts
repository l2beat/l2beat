import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export class BlockTipRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.findByProject = this.wrapFind(this.findByProject)
    this.updateByProject = this.wrapAny(this.updateByProject)
    this.deleteAll = this.wrapAny(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async findByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const row = await knex('transactions.block_tip')
      .where('project_id', projectId.toString())
      .first()

    if (!row || row.block_number === null || row.unix_timestamp === null) {
      return undefined
    }

    return {
      projectId,
      blockNumber: row.block_number,
      timestamp: UnixTime.fromDate(row.unix_timestamp),
    }
  }

  async updateByProject(
    projectId: ProjectId,
    tip: { blockNumber: number; timestamp: UnixTime } | undefined,
  ) {
    const knex = await this.knex()
    await knex('transactions.block_tip')
      .insert({
        project_id: projectId.toString(),
        block_number: tip?.blockNumber,
        unix_timestamp: tip?.timestamp.toDate(),
      })
      .onConflict('project_id')
      .merge()
  }

  async deleteAll() {
    const knex = await this.knex()
    await knex('transactions.block_tip').delete()
  }
}
