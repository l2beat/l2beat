import {
  assert,
  LivenessType,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../../liveness/repositories/LivenessRepository'

export abstract class BaseAnalyzer {
  constructor(
    protected readonly provider: RpcClient,
    protected readonly livenessRepository: LivenessRepository,
    protected readonly projectId: ProjectId,
    protected readonly l2Provider?: RpcClient,
  ) {}

  async getFinalityWithGranularity(
    from: UnixTime,
    to: UnixTime,
    granularity: number,
  ) {
    const interval = this.getInterval(from, to, granularity)

    const transactions = (
      await Promise.all(
        Array.from({ length: granularity }).map(async (_, i) => {
          const targetTimestamp = to.add(-interval * i, 'seconds')
          const lowerBound = targetTimestamp.add(-interval, 'seconds')

          return this.livenessRepository.findTransactionWithinTimeRange(
            this.projectId,
            this.getLivenessType(),
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

  private getInterval(from: UnixTime, to: UnixTime, granularity: number) {
    assert(to.toNumber() > from.toNumber())
    return (to.toNumber() - from.toNumber()) / granularity
  }

  abstract getLivenessType(): LivenessType
  abstract getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]>
}
