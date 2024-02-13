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

type zkSyncEraDecoded = [
  [number, string, number, number, string, string, number, string],
  [number, string, number, number, string, string, number, string][],
  [number[], number[]],
]

export class zkSyncEraFinalityAnalyzer implements BaseAnalyzer {
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
            ProjectId('zksync2'),
            LivenessType('PROOF'),
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

  async getFinality(transaction: { txHash: string; timestamp: UnixTime }) {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = decodeInput(tx.data)
    const timestamps: number[] = []

    timestamps.push(Number(decodedInput[0][6]))
    decodedInput[1].forEach((batch) => {
      timestamps.push(Number(batch[6]))
    })

    return timestamps.map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)
  }
}

function decodeInput(data: string) {
  const fnSignature =
    'proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32), (uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[], (uint256[],uint256[]))'
  const i = new utils.Interface([`function ${fnSignature}`])
  const decodedInput = i.decodeFunctionData(
    fnSignature,
    data,
  ) as zkSyncEraDecoded
  return decodedInput
}
