import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { chunk } from 'lodash'

import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { StarknetClient } from '../../../../peripherals/starknet/StarknetClient'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'

export type Transaction = {
  txHash: string
  timestamp: UnixTime
}

export abstract class BaseAnalyzer<
  L2RpcClient extends RpcClient | StarknetClient = RpcClient,
> {
  constructor(
    protected readonly provider: RpcClient,
    protected readonly livenessRepository: LivenessRepository,
    protected readonly projectId: ProjectId,
    protected readonly l2Provider?: L2RpcClient,
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

    for (const batch of batchedTransactions) {
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
