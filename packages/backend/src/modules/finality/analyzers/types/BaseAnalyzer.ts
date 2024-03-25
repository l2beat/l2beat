import {
  assert,
  notUndefined,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'

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
  ): Promise<number[] | undefined> {
    const interval = this.getInterval(from, to, granularity)

    const transactions = (
      await Promise.all(
        Array.from({ length: granularity }).map(async (_, i) => {
          const targetTimestamp = to.add(-interval * i, 'seconds')
          const lowerBound = targetTimestamp.add(-interval, 'seconds')

          return this.livenessRepository.findTransactionWithinTimeRange(
            this.projectId,
            this.getTrackedTxSubtype(),
            targetTimestamp,
            lowerBound,
          )
        }),
      )
    ).filter(notUndefined)

    if (!transactions.length) {
      return undefined
    }

    const finalityDelays = []
    for (const tx of transactions) {
      const delay = await this.getFinality(tx)
      finalityDelays.push(delay)
    }

    return finalityDelays.flat()
  }

  private getInterval(from: UnixTime, to: UnixTime, granularity: number) {
    assert(to.toNumber() > from.toNumber())
    return (to.toNumber() - from.toNumber()) / granularity
  }

  abstract getTrackedTxSubtype(): TrackedTxsConfigSubtype
  abstract getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]>
}
