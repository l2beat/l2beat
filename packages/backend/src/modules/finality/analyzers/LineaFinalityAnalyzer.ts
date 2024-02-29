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

    assert(this.l2Provider, 'Linea RPC provider not defined')
    const timestamps = await Promise.all([
      (await this.l2Provider.getBlock(firstBlockInData)).timestamp,
      (await this.l2Provider.getBlock(lastBlockInData)).timestamp,
    ])

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
