import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { BaseAnalyzer } from './types/BaseAnalyzer'

type zkSyncEraDecoded = [
  number,
  [number, string, number, number, string, string, number, string],
  [number, string, number, number, string, string, number, string][],
  [number[], number[]],
]

export class zkSyncEraFinalityAnalyzer extends BaseAnalyzer {
  getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'proofSubmissions'
  }

  async analyze(transaction: { txHash: string; timestamp: UnixTime }) {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = this.decodeInput(tx.data)
    const timestamps: number[] = []

    timestamps.push(Number(decodedInput[1][6]))
    decodedInput[2].forEach((batch) => {
      timestamps.push(Number(batch[6]))
    })

    return timestamps.map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)
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
