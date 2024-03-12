import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { BaseAnalyzer } from './types/BaseAnalyzer'

type zkSyncEraDecoded = [
  [number, string, number, number, string, string, number, string],
  [number, string, number, number, string, string, number, string][],
  [number[], number[]],
]

export class zkSyncEraFinalityAnalyzer extends BaseAnalyzer {
  getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'proofSubmissions'
  }

  async getFinality(transaction: { txHash: string; timestamp: UnixTime }) {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = this.decodeInput(tx.data)
    const timestamps: number[] = []

    timestamps.push(Number(decodedInput[0][6]))
    decodedInput[1].forEach((batch) => {
      timestamps.push(Number(batch[6]))
    })

    return timestamps.map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)
  }

  private decodeInput(data: string) {
    const fnSignature =
      'proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32), (uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[], (uint256[],uint256[]))'
    const i = new utils.Interface([`function ${fnSignature}`])
    const decodedInput = i.decodeFunctionData(
      fnSignature,
      data,
    ) as zkSyncEraDecoded
    return decodedInput
  }
}
