import type { Logger } from '@l2beat/backend-tools'
import type { Database, L2CostRecord } from '@l2beat/database'
import type { TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxResult } from '../../types/model'
import type { TxUpdaterInterface } from '../../types/TxUpdaterInterface'
import { ONE_BLOB_GAS } from '../../utils/const'
import type { BlobPriceProvider } from './BlobPriceProvider'

export class L2CostsUpdater implements TxUpdaterInterface<'l2costs'> {
  type = 'l2costs' as const

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly blobPriceProvider: BlobPriceProvider,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[]) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }
    const blockNumbers = transactions.map((tx) => tx.blockNumber)
    const oldestBlock = Math.min(...blockNumbers)
    const newestBlock = Math.max(...blockNumbers)
    const blobPriceByBlock =
      await this.blobPriceProvider.getBlobPricesByBlockRange([
        oldestBlock,
        newestBlock,
      ])

    const transformed = this.transform(transactions, blobPriceByBlock)
    await this.db.l2Cost.insertMany(transformed)
    this.logger.info('Updated L2 costs', { count: transactions.length })
  }

  async deleteFromById(id: TrackedTxId, fromInclusive: UnixTime) {
    await this.db.l2Cost.deleteFromById(id, fromInclusive)
  }

  transform(
    transactions: TrackedTxResult[],
    blobBaseFeeByBlock: Map<number, bigint>,
  ): L2CostRecord[] {
    return transactions.map((tx) => {
      const blobBaseFee = blobBaseFeeByBlock.get(tx.blockNumber)

      if (tx.blobVersionedHashes && !blobBaseFee) {
        throw new Error(`Blob base fee not found for block ${tx.blockNumber}`)
      }
      return {
        timestamp: tx.blockTimestamp,
        txHash: tx.hash,
        configurationId: tx.id,
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        calldataLength: tx.dataLength,
        calldataGasUsed: tx.calldataGasUsed,
        blobGasUsed: tx.blobVersionedHashes
          ? tx.blobVersionedHashes.length * ONE_BLOB_GAS
          : null,
        blobGasPrice: blobBaseFee ?? null,
      }
    })
  }
}
