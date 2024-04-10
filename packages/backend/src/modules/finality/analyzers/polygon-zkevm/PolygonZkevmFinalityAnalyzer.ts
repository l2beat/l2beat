import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { z } from 'zod'

import { byteArrFromHexStr } from '../opStack/utils'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import { decodeBatchV2 } from './batch-decoder'
import { getTransactionHash } from './getTransactionHash'

export class StarknetFinalityAnalyzer extends BaseAnalyzer {
  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedBatches = decodeTransaction(tx.data)
      .map(byteArrFromHexStr)
      .map(decodeBatchV2)
      .flat()

    const decodedTransactions = decodedBatches.flatMap(
      (batch) => batch.transactions,
    )

    const hashes = decodedTransactions.map((tx) =>
      getTransactionHash(
        {
          nonce: tx.nonce,
          gasPrice: tx.gasPrice,
          gasLimit: tx.gas,
          to: tx.to,
          value: tx.value,
          data: tx.data,
          chainId: 1101, // ZKEVM chain ID
        },
        {
          v: tx.v.toNumber(),
          r: tx.r.toHexString(),
          s: tx.s.toHexString(),
        },
      ),
    )

    // TODO: Call rpc
    // TODO: Get blocks
    // TODO: Get max and min blocks timestamps
    // TODO: Return timestamps

    return [l1Timestamp.toNumber()]
  }
}

const signature = `sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, uint64 maxSequenceTimestamp, uint64 initSequencedBatch, address l2Coinbase)`
const iface = new utils.Interface([`function ${signature}`])

const ZBigNumber = z.instanceof(BigNumber).transform((n) => n.toBigInt())

const SingleBatch = z.object({
  transactions: z.string(),
  forcedGlobalExitRoot: z.string(),
  forcedBlockHashL1: z.string(),
})
type SingleBatch = z.infer<typeof SingleBatch>

const NewAPI = z.object({
  batches: z.array(SingleBatch),
  maxSequenceTimestamp: ZBigNumber,
  initSequencedBatch: ZBigNumber,
  l2Coinbase: z.string(),
})
type NewAPI = z.infer<typeof NewAPI>

function decodeTransaction(data: string): string[] {
  const decodedInput = iface.decodeFunctionData(signature, data)

  const batches = decodedInput.batches as SingleBatch[]

  return batches.map((batch) => batch.transactions)
}
