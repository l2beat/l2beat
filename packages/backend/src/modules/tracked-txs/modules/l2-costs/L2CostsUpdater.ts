import type { Logger } from '@l2beat/backend-tools'
import type { Database, L2CostRecord } from '@l2beat/database'
import type { RpcClient, TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxResult } from '../../types/model'
import type { TxUpdaterInterface } from '../../types/TxUpdaterInterface'

export class L2CostsUpdater implements TxUpdaterInterface<'l2costs'> {
  type = 'l2costs' as const

  constructor(
    private readonly db: Database,
    private readonly rpc: RpcClient,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[]) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }

    const withBlobsData = await Promise.all(
      transactions.map(async (t) => {
        if (t.txType === 3) {
          const txReceipt = await this.rpc.getTransactionReceipt(t.hash)
          return {
            ...t,
            blobGasUsed: txReceipt.blobGasUsed ?? null,
            blobGasPrice: txReceipt.blobGasPrice ?? null,
          }
        }

        return { ...t, blobGasUsed: null, blobGasPrice: null }
      }),
    )

    const transformed = this.transform(withBlobsData)
    await this.db.l2Cost.insertMany(transformed)
    this.logger.info('Updated L2 costs', { count: transactions.length })
  }

  async deleteFromById(id: TrackedTxId, fromInclusive: UnixTime) {
    await this.db.l2Cost.deleteFromById(id, fromInclusive)
  }

  transform(
    transactions: (TrackedTxResult & {
      blobGasUsed: bigint | null
      blobGasPrice: bigint | null
    })[],
  ): L2CostRecord[] {
    return transactions.map((tx) => ({
      timestamp: tx.blockTimestamp,
      txHash: tx.hash,
      configurationId: tx.id,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      calldataLength: tx.dataLength,
      calldataGasUsed: tx.calldataGasUsed,
      blobGasUsed: tx.blobGasUsed ? Number(tx.blobGasUsed) : null,
      blobGasPrice: tx.blobGasPrice,
    }))
  }
}
