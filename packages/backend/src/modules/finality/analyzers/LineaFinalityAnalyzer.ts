import { UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { BaseAnalyzer } from './types/BaseAnalyzer'

type LineaDecoded = [
  [string, number, string, unknown[], string, unknown[]][],
  string,
  number,
  string,
]

export class LineaFinalityAnalyzer extends BaseAnalyzer {
  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = this.decodeInput(tx.data)
    const timestamps = decodedInput[0].map((x) => x[1])

    return timestamps.map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)
  }

  private decodeInput(data: string) {
    const fnSignature =
      'finalizeBlocks((bytes32,uint32,bytes[],bytes32[],bytes,uint16[])[], bytes, uint256, bytes32)'
    const iface = new utils.Interface([`function ${fnSignature}`])
    const decodedInput = iface.decodeFunctionData(
      fnSignature,
      data,
    ) as LineaDecoded
    return decodedInput
  }
}
