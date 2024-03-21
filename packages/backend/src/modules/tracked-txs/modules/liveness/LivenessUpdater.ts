import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { TrackedTxResult } from '../../types/model'
import { TrackedTxId } from '../../types/TrackedTxId'
import { TxUpdaterInterface } from '../../types/TxUpdaterInterface'
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
  }

  async deleteAfter(
    id: TrackedTxId,
    untilTimestamp: UnixTime,
    knexTrx: Knex.Transaction,
  ) {
    await this.livenessRepository.deleteAfter(id, untilTimestamp, knexTrx)
  }

  transformTransactions(transactions: TrackedTxResult[]): LivenessRecord[] {
    return transactions.map((t) => ({
      timestamp: t.blockTimestamp,
      blockNumber: t.blockNumber,
      trackedTxId: t.use.id,
      txHash: t.hash,
    }))
  }
}
