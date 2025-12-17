import type { Logger } from '@l2beat/backend-tools'
import type { Database, L2CostRecord } from '@l2beat/database'
import type { IRpcClient, TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import uniq from 'lodash/uniq'
import type { TrackedTxResult } from '../../types/model'
import type { TxUpdaterInterface } from '../../types/TxUpdaterInterface'
import { ONE_BLOB_GAS } from '../../utils/const'

export class L2CostsUpdater implements TxUpdaterInterface<'l2costs'> {
  type = 'l2costs' as const

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly ethRpcClient: IRpcClient,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[]) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }
    const uniqueBlockNumbers = uniq(transactions.map((tx) => tx.blockNumber))
    const newestBlock = Math.max(...uniqueBlockNumbers)
    const oldestBlock = Math.min(...uniqueBlockNumbers)
    this.logger.info('Getting blob base fees', {
      newestBlock,
      oldestBlock,
      blocksCount: uniqueBlockNumbers.length,
    })
    const blockDiff = newestBlock - oldestBlock
    const chunkCount = Math.ceil(blockDiff / 1000)
    const blobBaseFeeByBlock = new Map<number, bigint>()
    for (const chunk of range(chunkCount)) {
      this.logger.info('Getting blob base fees', {
        chunk,
        params: {
          blockCount: 1000,
          newestBlock: newestBlock - chunk * 1000,
          rewardPercentiles: [],
        },
      })
      const feeHistory = await this.ethRpcClient.getFeeHistory(
        1000,
        newestBlock - chunk * 1000,
        [],
      )
      let startBlock = feeHistory.oldestBlock
      for (const blobBaseFee of feeHistory.baseFeePerBlobGas) {
        if (blobBaseFee === 0n) continue
        blobBaseFeeByBlock.set(startBlock, blobBaseFee)
        startBlock++
      }
    }

    const transformed = this.transform(transactions, blobBaseFeeByBlock)
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
