import { assert, LivenessType, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { BaseAnalyzer } from './types/BaseAnalyzer'

type LineaDecoded = [[string, string, string, number, number, string, string]]

export class LineaFinalityAnalyzer extends BaseAnalyzer {
  override getLivenessType(): LivenessType {
    return 'DA'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = this.decodeInput(tx.data)

    const firstBlockInData = Number(decodedInput[0][3])
    const lastBlockInData = Number(decodedInput[0][4])

    const timestampsPromises = Array.from(
      { length: lastBlockInData - firstBlockInData + 1 },
      async (_, i) => {
        assert(this.l2Provider, 'Linea provider is not set')
        const block = await this.l2Provider.getBlock(firstBlockInData + i)
        return block.timestamp
      },
    )
    const timestamps = await Promise.all(timestampsPromises)

    return timestamps.map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)
  }

  private decodeInput(data: string) {
    const fnSignature =
      'submitData((bytes32,bytes32,bytes32,uint256,uint256,bytes32,bytes))'
    const iface = new utils.Interface([`function ${fnSignature}`])
    const decodedInput = iface.decodeFunctionData(
      fnSignature,
      data,
    ) as LineaDecoded
    return decodedInput
  }
}
