import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { TrackedTxId } from '../../types/TrackedTxId'
import { TxUpdaterInterface } from '../../types/TxUpdaterInterface'
import { TrackedTxResult } from '../../types/model'
import {
  L2CostsRecord,
  L2CostsRepository,
} from './repositories/L2CostsRepository'

export class L2CostsUpdater implements TxUpdaterInterface {
  constructor(
    private readonly l2CostsRepository: L2CostsRepository,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[], knexTx?: Knex.Transaction) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }

    const transformed = await this.transform(transactions)
    await this.l2CostsRepository.addMany(transformed, knexTx)
  }

  async deleteFromById(
    id: TrackedTxId,
    untilTimestamp: UnixTime,
    knexTrx: Knex.Transaction,
  ) {
    await this.l2CostsRepository.deleteFromById(id, untilTimestamp, knexTrx)
  }

  async deleteAfter(after: UnixTime) {
    await this.l2CostsRepository.deleteAfter(after)
  }

  async transform(transactions: TrackedTxResult[]): Promise<L2CostsRecord[]> {
    return transactions.map((tx) => ({
      timestamp: tx.blockTimestamp,
      txHash: tx.hash,
      trackedTxId: tx.use.id,
      gasUsed: tx.receiptGasUsed,
      gasPrice: tx.gasPrice,
      calldataLength: tx.dataLength,
      calldataGasUsed: tx.calldataGasUsed,
      blobGasUsed: tx.receiptBlobGasUsed,
      blobGasPrice: tx.receiptBlobGasPrice,
    }))
  }
}
