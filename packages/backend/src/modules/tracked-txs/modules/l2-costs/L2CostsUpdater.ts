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
import { calculateCallDataGasUsed } from './utils/calculateCallDataGasUsed'

export class L2CostsUpdater implements TxUpdaterInterface {
  constructor(
    private readonly l2CostsRepository: L2CostsRepository,
    private readonly rpcClient: ViemRpcClient,
    private readonly logger: Logger,
  ) {}

  async update(transactions: TrackedTxResult[], knexTx?: Knex.Transaction) {
    if (transactions.length === 0) {
      this.logger.debug('[L2Costs]: Update skipped')
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
    const promises = transactions.map(async (t) => {
      const txDetails = await this.rpcClient.getTransaction(
        t.hash as `0x${string}`,
      )

      if (
        t.transactionType === 0 ||
        t.transactionType === 1 ||
        t.transactionType === 2
      ) {
        return {
          timestamp: t.blockTimestamp,
          txHash: t.hash,
          trackedTxId: t.use.id,
          data: {
            type: t.transactionType,
            gasUsed: t.receiptGasUsed,
            gasPrice: t.gasPrice,
            calldataLength: txDetails.input.slice(2).length / 2,
            calldataGasUsed: calculateCallDataGasUsed(txDetails.input),
          },
        }
      } else if (t.transactionType === 3) {
        const receipt = await this.rpcClient.getTransactionReceipt(
          t.hash as `0x${string}`,
        )

        return {
          timestamp: t.blockTimestamp,
          txHash: t.hash,
          trackedTxId: t.use.id,
          data: {
            type: t.transactionType,
            gasUsed: t.receiptGasUsed,
            gasPrice: t.gasPrice,
            calldataLength: txDetails.input.slice(2).length / 2,
            calldataGasUsed: calculateCallDataGasUsed(txDetails.input),
            blobGasUsed: Number(receipt.blobGasUsed),
            blobGasPrice: Number(receipt.blobGasPrice),
          },
        }
      } else {
        assertUnreachable(t.transactionType)
      }
    })
    return await Promise.all(promises)
  }
}
