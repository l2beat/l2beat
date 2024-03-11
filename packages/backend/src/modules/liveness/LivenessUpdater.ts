import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { TrackedTxsConfigsRepository } from '../tracked-txs/repositories/TrackedTxsConfigsRepository'
import { TrackedTxResult } from '../tracked-txs/types/model'
import { TrackedTxId } from '../tracked-txs/types/TrackedTxId'
import { TxUpdaterInterface } from '../tracked-txs/types/TxUpdaterInterface'
import {
  LivenessRecord,
  LivenessRepository,
} from './repositories/LivenessRepository'

export class LivenessUpdater implements TxUpdaterInterface {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly configurationRepository: TrackedTxsConfigsRepository,
    private readonly logger: Logger,
  ) {}

  async update(transactions: TrackedTxResult[], knexTx?: Knex.Transaction) {
    if (transactions.length === 0) {
      this.logger.debug('[Liveness]: Update skipped')
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
