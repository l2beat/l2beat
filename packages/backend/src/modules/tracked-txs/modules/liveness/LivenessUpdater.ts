import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { TrackedTxId } from '@l2beat/shared'
import { TxUpdaterInterface } from '../../types/TxUpdaterInterface'
import { TrackedTxResult } from '../../types/model'
import {
  LivenessRecord,
  LivenessRepository,
} from './repositories/LivenessRepository'

export class LivenessUpdater implements TxUpdaterInterface {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[], knexTx?: Knex.Transaction) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }

    const transformedTransactions = this.transformTransactions(transactions)
    await this.livenessRepository.addMany(transformedTransactions, knexTx)
    this.logger.info('Updated liveness', { count: transactions.length })
  }

  async deleteFromById(
    id: TrackedTxId,
    fromInclusive: UnixTime,
    knexTrx: Knex.Transaction,
  ) {
    await this.livenessRepository.deleteFromById(id, fromInclusive, knexTrx)
  }

  transformTransactions(transactions: TrackedTxResult[]): LivenessRecord[] {
    return transactions.map((t) => ({
      timestamp: t.blockTimestamp,
      blockNumber: t.blockNumber,
      configurationId: t.id,
      txHash: t.hash,
    }))
  }
}
