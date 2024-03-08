import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigsRepository } from '../tracked-txs/repositories/TrackedTxsConfigsRepository'
import {
  ParsedBigQueryFunctionCallResult,
  ParsedBigQueryTransferResult,
} from '../tracked-txs/types/model'
import {
  LivenessRecord,
  LivenessRepository,
} from './repositories/LivenessRepository'

export class LivenessUpdater {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly configurationRepository: TrackedTxsConfigsRepository,
    private readonly logger: Logger,
  ) {}

  async update(
    transactions: (
      | ParsedBigQueryFunctionCallResult
      | ParsedBigQueryTransferResult
    )[],
    from: UnixTime,
    to: UnixTime,
  ) {
    if (transactions.length === 0) {
      this.logger.debug('Update skipped', { from, to })
      return to.toNumber()
    }

    const transformedTransactions = this.transformTransactions(transactions)

    await this.livenessRepository.runInTransaction(async (trx) => {
      await this.livenessRepository.addMany(transformedTransactions, trx)

      await this.configurationRepository.setLastSyncedTimestamp(
        transformedTransactions.map((c) => c.trackedTxId),
        to,
        trx,
      )
    })
  }

  transformTransactions(
    transactions: (
      | ParsedBigQueryFunctionCallResult
      | ParsedBigQueryTransferResult
    )[],
  ): LivenessRecord[] {
    return transactions.map((t) => ({
      timestamp: t.blockTimestamp,
      blockNumber: t.blockNumber,
      trackedTxId: t.use.id,
      txHash: t.hash,
    }))
  }
}
