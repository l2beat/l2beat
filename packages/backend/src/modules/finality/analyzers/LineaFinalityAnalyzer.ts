import {
  assert,
  LivenessType,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { mean } from 'lodash'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../liveness/repositories/LivenessRepository'
import { BaseAnalyzer } from './types/BaseAnalyzer'

type LineaDecoded = [
  [string, number, string, unknown[], string, unknown[]][],
  string,
  number,
  string,
]

export class LineaFinalityAnalyzer implements BaseAnalyzer {
  constructor(
    private readonly provider: RpcClient,
    private readonly livenessRepository: LivenessRepository,
  ) {}

  async getFinalityWithGranularity(
    from: UnixTime,
    to: UnixTime,
    granularity: number,
  ) {
    assert(to.toNumber() > from.toNumber())
    const interval = (to.toNumber() - from.toNumber()) / granularity

    const transactions = (
      await Promise.all(
        Array.from({ length: granularity }).map(async (_, i) => {
          const targetTimestamp = to.add(-interval * i, 'seconds')
          const lowerBound = targetTimestamp.add(-interval, 'seconds')

          return this.livenessRepository.findTransactionWithinTimeRange(
            ProjectId('linea'),
            LivenessType('STATE'),
            targetTimestamp,
            lowerBound,
          )
        }),
      )
    ).filter(notUndefined)

    if (!transactions.length) {
      return undefined
    }

    const minimums: number[] = []
    const maximums: number[] = []
    const averages: number[] = []

    await Promise.all(
      transactions.map(async (transaction) => {
        const finality = await this.getFinality(transaction)
        minimums.push(finality.minimum)
        maximums.push(finality.maximum)
        averages.push(finality.average)
      }),
    )

    return {
      minimumTimeToInclusion: Math.min(...minimums),
      maximumTimeToInclusion: Math.max(...maximums),
      averageTimeToInclusion: Math.round(mean(averages)),
    }
  }

  async getFinality(transaction: { txHash: string; timestamp: UnixTime }) {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = decodeInput(tx.data)
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

function decodeInput(data: string) {
  const fnSignature =
    'finalizeBlocks((bytes32,uint32,bytes[],bytes32[],bytes,uint16[])[], bytes, uint256, bytes32)'
  const iface = new utils.Interface([`function ${fnSignature}`])
  const decodedInput = iface.decodeFunctionData(
    fnSignature,
    data,
  ) as LineaDecoded
  return decodedInput
}
