import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { chunk } from 'lodash'

import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'

export type Transaction = {
  txHash: string
  timestamp: UnixTime
}

export abstract class BaseAnalyzer {
  constructor(
    protected readonly provider: RpcClient,
    protected readonly livenessRepository: LivenessRepository,
    protected readonly projectId: ProjectId,
  ) {}

  async getFinalityForInterval(
    from: UnixTime,
    to: UnixTime,
  ): Promise<number[] | undefined> {
    const transactions =
      await this.livenessRepository.getTransactionsWithinTimeRange(
        this.projectId,
        this.getTrackedTxSubtype(),
        from,
        to,
      )

    if (!transactions.length) {
      return undefined
    }

    const finalityDelays = []
    const batchedTransactions = chunk(transactions, 10)

    let i = 0
    for (const batch of batchedTransactions) {
      console.log('batch', i++, 'of', batchedTransactions.length)
      console.log('project:', this.projectId)
      const delays = await Promise.all(batch.map((tx) => this.getFinality(tx)))
      finalityDelays.push(delays.flat())
    }

    return finalityDelays.flat()
  }

  abstract getTrackedTxSubtype(): TrackedTxsConfigSubtype

  /**
   *
   * @param transaction
   * @returns Finality delays in seconds for each transaction
   */
  abstract getFinality(transaction: Transaction): Promise<number[]>
}
