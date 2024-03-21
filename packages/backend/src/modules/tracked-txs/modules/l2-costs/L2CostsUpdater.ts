import { Logger } from '@l2beat/backend-tools'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { ViemRpcClient } from '../../../../peripherals/viem-rpc-client/ViemRpcClient'
import { TrackedTxResult } from '../../types/model'
import { TrackedTxId } from '../../types/TrackedTxId'
import { TxUpdaterInterface } from '../../types/TxUpdaterInterface'
import {
  L2CostsRecord,
  L2CostsRepository,
} from './repositories/L2CostsRepository'

export class L2CostsUpdater implements TxUpdaterInterface {
  constructor(
    private readonly l2CostsRepository: L2CostsRepository,
    private readonly rpcClient: ViemRpcClient,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[], knexTx?: Knex.Transaction) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }

    const transformedTransactions =
      await this.addDetailsTransactionsAndTransform(transactions)
    await this.l2CostsRepository.addMany(transformedTransactions, knexTx)
  }

  async deleteAfter(
    id: TrackedTxId,
    untilTimestamp: UnixTime,
    knexTrx: Knex.Transaction,
  ) {
    await this.l2CostsRepository.deleteAfter(id, untilTimestamp, knexTrx)
  }

  async addDetailsTransactionsAndTransform(
    transactions: TrackedTxResult[],
  ): Promise<L2CostsRecord[]> {
    const promises = transactions.map(async (tx) => {
      if (
        tx.transactionType === 0 ||
        tx.transactionType === 1 ||
        tx.transactionType === 2
      ) {
        return {
          timestamp: tx.blockTimestamp,
          txHash: tx.hash,
          trackedTxId: tx.use.id,
          data: {
            type: tx.transactionType,
            gasUsed: tx.receiptGasUsed,
            gasPrice: tx.gasPrice,
            calldataLength: tx.dataLength,
            calldataGasUsed: tx.calldataGasUsed,
          },
        }
      } else if (tx.transactionType === 3) {
        const receipt = await this.rpcClient.getTransactionReceipt(
          tx.hash as `0x${string}`,
        )

        return {
          timestamp: tx.blockTimestamp,
          txHash: tx.hash,
          trackedTxId: tx.use.id,
          data: {
            type: tx.transactionType,
            gasUsed: tx.receiptGasUsed,
            gasPrice: tx.gasPrice,
            calldataLength: tx.dataLength,
            calldataGasUsed: tx.calldataGasUsed,
            blobGasUsed: Number(receipt.blobGasUsed),
            blobGasPrice: Number(receipt.blobGasPrice),
          },
        }
      } else {
        assertUnreachable(tx.transactionType)
      }
    })
    return await Promise.all(promises)
  }
}
