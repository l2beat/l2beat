import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { BaseAnalyzer } from './types/BaseAnalyzer'

type PolygonZkEVMDecoded = [[string, string, number, number][], string]

export class PolygonZkEVMFinalityAnalyzer extends BaseAnalyzer {
  getProjectId(): ProjectId {
    return ProjectId('polygonzkevm')
  }

  getLivenessType(): LivenessType {
    return LivenessType('DA')
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = decodeInput(tx.data)
    const timestamps = decodedInput[0].map((x) => x[2])

    return timestamps.map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)
  }
}

function decodeInput(data: string) {
  const fnSignature =
    'sequenceBatches((bytes,bytes32,uint64,uint64)[], address)'
  const iface = new utils.Interface([`function ${fnSignature}`])
  const decodedInput = iface.decodeFunctionData(
    fnSignature,
    data,
  ) as PolygonZkEVMDecoded
  return decodedInput
}
