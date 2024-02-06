import {
  assert,
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

  async getFinalityWithGranularity(
    from: UnixTime,
    to: UnixTime,
    granularity: number,
  ) {
    const interval = (from.toNumber() - to.toNumber()) / granularity

    const txHashes = (
      await Promise.all(
        Array.from({ length: granularity }).map(async (_, i) => {
          const targetTimestamp = from.add(-interval * i, 'seconds')
          const lowerBound = targetTimestamp.add(-interval, 'seconds')

          return this.livenessRepository.findTransactionWithinTimeRange(
            ProjectId('linea'),
            LivenessType('STATE'),
            targetTimestamp,
            lowerBound,
          )
        }),
      )
    )
      .filter(notUndefined)
      .map((x) => x.txHash)

    if (!txHashes.length) {
      return undefined
    }

    const minimums: number[] = []
    const maximums: number[] = []
    const averages: number[] = []

    await Promise.all(
      txHashes.map(async (hash) => {
        const finality = await this.getFinality(hash)
        minimums.push(finality.minimum)
        maximums.push(finality.maximum)
        averages.push(finality.average)
      }),
    )

    return {
      minimum: Math.min(...minimums),
      maximum: Math.max(...maximums),
      average: Math.round(mean(averages)),
    }
  }

  async getFinality(txHash: string) {
    const tx = await this.provider.getTransaction(txHash)
    assert(tx.timestamp, 'There is no timestamp for transaction')
    const l1Timestamp = new UnixTime(tx.timestamp)

    const data = tx.data
    const fnSignature =
      'finalizeBlocks((bytes32,uint32,bytes[],bytes32[],bytes,uint16[])[], bytes, uint256, bytes32)'
    const iface = new utils.Interface([`function ${fnSignature}`])
    const decodedInput = iface.decodeFunctionData(
      fnSignature,
      data,
    ) as LineaDecoded
    const timestamps = decodedInput[0].map((x) => x[1])
    const delays = timestamps.map(
      (l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp,
    )
    const minimum = Math.min(...delays)
    const maximum = Math.max(...delays)
    const average = Math.round(mean(delays))
    return {
      minimum,
      maximum,
      average,
    }
  }
}
