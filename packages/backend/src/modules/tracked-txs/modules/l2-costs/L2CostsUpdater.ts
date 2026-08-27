import type { Logger } from '@l2beat/backend-tools'
import type { Database, L2CostRecord } from '@l2beat/database'
import type { TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { withCoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
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
    return await withCoreFeatureRpcMetricsContext(
      'trackedTxs.l2costs',
      { chain: 'ethereum' },
      async () => {
        const blockNumbers = transactions.map((tx) => tx.blockNumber)
        const oldestBlock = Math.min(...blockNumbers)
        const newestBlock = Math.max(...blockNumbers)
        const blobPriceByBlock =
          await this.blobPriceProvider.getBlobPricesByBlockRange([
            oldestBlock,
            newestBlock,
          ])

        const transformed = this.transform(transactions, blobPriceByBlock)
        const deduplicated = transactions.length - transformed.length
        if (deduplicated > 0) {
          this.logger.info('Deduplicated L2 cost transactions', {
            count: deduplicated,
          })
        }
        await this.db.l2Cost.insertMany(transformed)
        this.logger.info('Updated L2 costs', { count: transformed.length })
      },
    )
  }

  async deleteFromById(id: TrackedTxId, fromInclusive: UnixTime) {
    await this.db.l2Cost.deleteFromById(id, fromInclusive)
  }

  transform(
    transactions: TrackedTxResult[],
    blobBaseFeeByBlock: Map<number, bigint>,
  ): L2CostRecord[] {
    const records = new Map<string, L2CostRecord>()

    for (const tx of transactions) {
      // The query returns matching calls, while costs are stored per
      // transaction. A transaction can match the same configuration more than
      // once when it contains multiple matching calls.
      const key = `${tx.id}-${tx.hash}`
      if (records.has(key)) continue

      const blobBaseFee = blobBaseFeeByBlock.get(tx.blockNumber)

      if (tx.blobVersionedHashes && !blobBaseFee) {
        throw new Error(`Blob base fee not found for block ${tx.blockNumber}`)
      }

      const blobGasUsed = tx.blobVersionedHashes
        ? tx.blobVersionedHashes.length * ONE_BLOB_GAS
        : null
      records.set(key, {
        timestamp: tx.blockTimestamp,
        txHash: tx.hash,
        configurationId: tx.id,
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        calldataLength: tx.dataLength,
        calldataGasUsed: tx.calldataGasUsed,
        blobGasUsed,
        blobGasPrice: blobGasUsed ? (blobBaseFee ?? null) : null,
      })
    }

    return [...records.values()]
  }
}
