import {
  assert,
  LivenessType,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../liveness/repositories/LivenessRepository'
import { BaseAnalyzer } from './types/BaseAnalyzer'

type PolygonZkEVMDecoded = [[string, string, number, number][], string]

export class PolygonZkEVMFinalityAnalyzer implements BaseAnalyzer {
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
            ProjectId('polygonzkevm'),
            LivenessType('DA'),
            targetTimestamp,
            lowerBound,
          )
        }),
      )
    ).filter(notUndefined)

    if (!transactions.length) {
      return undefined
    }

    const finalityDelays = (
      await Promise.all(
        transactions.map(async (transaction) => {
          return this.getFinality(transaction)
        }),
      )
    ).flat()

    return finalityDelays
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
