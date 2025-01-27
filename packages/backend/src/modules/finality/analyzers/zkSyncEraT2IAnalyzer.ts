import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { BaseAnalyzer } from './types/BaseAnalyzer'
import type { L2Block, Transaction } from './types/BaseAnalyzer'

type zkSyncEraDecoded = [
  number,
  [number, string, number, number, string, string, number, string],
  [number, string, number, number, string, string, number, string][],
  [number[], number[]],
]

export class zkSyncEraT2IAnalyzer extends BaseAnalyzer {
  getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'proofSubmissions'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const decodedInput = this.decodeInput(tx.data)
    const blocks: L2Block[] = []

    // TODO(radomski): This is prevBatch, should we include it?
    blocks.push({
      timestamp: Number(decodedInput[1][6]),
      blockNumber: Number(decodedInput[1][0]),
    })

    decodedInput[2].forEach((batch) => {
      blocks.push({
        timestamp: Number(batch[6]),
        blockNumber: Number(batch[0]),
      })
    })

    return blocks
  }

  private decodeInput(data: string) {
    const fnSignature =
      'proveBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[], (uint256[] recursiveAggregationInput, uint256[] serializedProof))'
    const i = new utils.Interface([`function ${fnSignature}`])
    const decodedInput = i.decodeFunctionData(
      fnSignature,
      data,
    ) as zkSyncEraDecoded
    return decodedInput
  }
}
