import { Logger } from '@l2beat/backend-tools'
import { Database, L2CostRecord, Transaction } from '@l2beat/database'
import { TrackedTxId } from '@l2beat/shared'
import { TrackedTxsConfigType, UnixTime } from '@l2beat/shared-pure'
import { TxUpdaterInterface } from '../../types/TxUpdaterInterface'
import { TrackedTxResult } from '../../types/model'

export class L2CostsUpdater implements TxUpdaterInterface {
  type: TrackedTxsConfigType = 'l2costs'

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[], trx?: Transaction) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }

    const transformed = await this.transform(transactions)
    await this.db.l2Cost.addMany(transformed, trx)
    this.logger.info('Updated L2 costs', { count: transactions.length })
  }

  async deleteFromById(
    id: TrackedTxId,
    fromInclusive: UnixTime,
    trx: Transaction,
  ) {
    await this.db.l2Cost.deleteFromById(id, fromInclusive, trx)
  }

  async transform(transactions: TrackedTxResult[]): Promise<L2CostRecord[]> {
    return transactions.map((tx) => ({
      timestamp: tx.blockTimestamp,
      txHash: tx.hash,
      configurationId: tx.id,
      gasUsed: tx.receiptGasUsed,
      gasPrice: tx.gasPrice,
      calldataLength: tx.dataLength,
      calldataGasUsed: tx.calldataGasUsed,
      blobGasUsed: tx.receiptBlobGasUsed,
      blobGasPrice: tx.receiptBlobGasPrice,
    }))
  }
}
