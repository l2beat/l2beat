import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import { BaseAnalyzer } from '../types/BaseAnalyzer'

const StoredBatchInfoStruct = `(uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)`

type StoredBatchInfoStruct = {
  batchNumber: BigNumber
  batchHash: string
  indexRepeatedStorageChanges: BigNumber
  numberOfLayer1Txs: BigNumber
  priorityOperationsHash: string
  l2LogsTreeRoot: string
  timestamp: BigNumber
  commitment: string
}

const signature = `executeBatches(${StoredBatchInfoStruct}[] _newBatchesData)'`
const iface = new utils.Interface([`function ${signature}`])

export class zkSyncEraStateUpdateAnalyzer extends BaseAnalyzer {
  getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async getFinality(transaction: { txHash: string; timestamp: UnixTime }) {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const l2Timestamps = decodeTransaction(tx.data)

    return l2Timestamps.map(
      (l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp,
    )
  }
}

function decodeTransaction(data: string) {
  const decodedInput = iface.decodeFunctionData(signature, data)

  const executedBatches =
    decodedInput._newBatchesData as StoredBatchInfoStruct[]

  return executedBatches.map((batch) => batch.timestamp.toNumber())
}
