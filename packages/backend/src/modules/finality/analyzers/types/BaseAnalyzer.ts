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

  async analyzeInterval(
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

    for (const batch of batchedTransactions) {
      const delays = await Promise.all(batch.map((tx) => this.analyze(tx)))
      finalityDelays.push(delays.flat())
    }

    return finalityDelays.flat()
  }

  abstract getTrackedTxSubtype(): TrackedTxsConfigSubtype

  /**
   *
   * @param transaction
   * @returns TTI/SUD delays in seconds for each transaction
   */
  abstract analyze(transaction: Transaction): Promise<number[]>
}
