import {
  assert,
  LivenessType,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { sum } from 'lodash'

import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'

type LineaDecoded = [
  [string, number, string, unknown[], string, unknown[]][],
  string,
  number,
  string,
]

export class LineaFinalityCalculator {
  constructor(
    private readonly provider: RpcClient,
    private readonly livenessRepository: LivenessRepository,
  ) {}

  async getFinality(targetTimestamp: UnixTime, granularity: number) {
    const interval = 3600 / granularity
    const promises = Array.from({ length: granularity }).map(async (_, i) => {
      const tx_hash =
        await this.livenessRepository.findTxHashByProjectIdAndTimestamp(
          ProjectId('linea'),
          targetTimestamp.add(-interval * i, 'seconds'),
          targetTimestamp.add(-interval * (i + 1), 'seconds'),
          // Linea posts everything in the same tx, but we store it only once in STATE type txs
          LivenessType('STATE'),
          0,
        )
      if (!tx_hash) {
        return
      }
      const tx = await this.provider.getTransaction(tx_hash)
      assert(tx.blockNumber, 'Block number not found')
      const block = await this.provider.getBlock(tx.blockNumber)
      const timestamp = block.timestamp
      const data = tx.data

      const fnSignature =
        'finalizeBlocks((bytes32,uint32,bytes[],bytes32[],bytes,uint16[])[], bytes, uint256, bytes32)'
      const iface = new utils.Interface([`function ${fnSignature}`])
      const decodedInput = iface.decodeFunctionData(
        fnSignature,
        data,
      ) as LineaDecoded
      const timestamps = decodedInput[0].map((x) => x[1])
      const delays = timestamps.map((x) => timestamp - x)
      return delays
    })
    const delays = (await Promise.all(promises))
      .flatMap((x) => x)
      .filter(notUndefined)
    if (!delays.length) {
      return undefined
    }
    const minimum = Math.min(...delays)
    const maximum = Math.max(...delays)
    const average = Math.round(sum(delays) / delays.length)

    return {
      minimum,
      maximum,
      average,
    }
  }
}
