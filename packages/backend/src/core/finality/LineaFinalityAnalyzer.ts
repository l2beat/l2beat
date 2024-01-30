import {
  LivenessType,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { mean } from 'lodash'

import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'

type LineaDecoded = [
  [string, number, string, unknown[], string, unknown[]][],
  string,
  number,
  string,
]

export class LineaFinalityAnalyzer {
  constructor(
    private readonly provider: RpcClient,
    private readonly livenessRepository: LivenessRepository,
  ) {}

  async getFinalityForTimestamp(from: UnixTime, to: UnixTime) {
    const result = await this.livenessRepository.findTxByProjectIdAndTimestamp(
      ProjectId('linea'),
      from,
      to,
      // Linea posts everything in the same tx, but we store it only once in STATE type txs
      LivenessType('STATE'),
    )
    if (!result) {
      return
    }
    const { timestamp, txHash } = result
    const tx = await this.provider.getTransaction(txHash)
    const data = tx.data
    const fnSignature =
      'finalizeBlocks((bytes32,uint32,bytes[],bytes32[],bytes,uint16[])[], bytes, uint256, bytes32)'
    const iface = new utils.Interface([`function ${fnSignature}`])
    const decodedInput = iface.decodeFunctionData(
      fnSignature,
      data,
    ) as LineaDecoded
    const timestamps = decodedInput[0].map((x) => x[1])
    const delays = timestamps.map((x) => timestamp.toNumber() - x)
    const minimum = Math.min(...delays)
    const maximum = Math.max(...delays)
    const average = Math.round(mean(delays))
    return {
      minimum,
      maximum,
      average,
    }
  }

  async getFinalityWithGranularity(
    from: UnixTime,
    to: UnixTime,
    granularity: number,
  ) {
    const interval = (from.toNumber() - to.toNumber()) / granularity

    const promises = Array.from({ length: granularity }).map(async (_, i) =>
      this.getFinalityForTimestamp(
        from.add(-interval * i, 'seconds'),
        from.add(-interval * (i + 1), 'seconds'),
      ),
    )
    const delays = (await Promise.all(promises))
      .flatMap((x) => x)
      .filter(notUndefined)
    if (!delays.length) {
      return undefined
    }
    const minimums: number[] = []
    const maximums: number[] = []
    const averages: number[] = []
    delays.forEach((x) => {
      minimums.push(x.minimum)
      maximums.push(x.maximum)
      averages.push(x.average)
    })
    return {
      minimum: Math.min(...minimums),
      maximum: Math.max(...maximums),
      average: Math.round(mean(averages)),
    }
  }
}
