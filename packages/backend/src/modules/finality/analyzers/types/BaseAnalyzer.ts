import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { chunk } from 'lodash'

import { Database } from '@l2beat/database'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessWithConfigService } from '../../../tracked-txs/modules/liveness/services/LivenessWithConfigService'

export type Transaction = {
  txHash: string
  timestamp: UnixTime
}

export interface L2Block {
  timestamp: number
  blockNumber: number
}

export interface Batch {
  l1Timestamp: number
  l2Blocks: L2Block[]
}

export abstract class BaseAnalyzer {
  constructor(
    protected readonly provider: RpcClient,
    protected readonly db: Database,
    protected readonly projectId: ProjectId,
  ) {}

  async analyzeInterval(
    from: UnixTime,
    to: UnixTime,
  ): Promise<Batch[] | undefined> {
    const configs = await this.db.indexerConfiguration.getByIndexerId(
      'tracked_txs_indexer',
    )

    const projectConfigs = configs
      .map((c) => {
        const properties = JSON.parse(c.properties)
        return {
          id: c.id,
          projectId: properties.projectId,
          type: properties.type,
          subtype: properties.subtype,
        }
      })
      .filter(
        (c) =>
          c.projectId === this.projectId.toString() &&
          c.subtype === this.getTrackedTxSubtype() &&
          c.type === 'liveness',
      )

    assert(
      projectConfigs.length > 0,
      `No configurations found for the project ${this.projectId}`,
    )

    const livenessWithConfig = new LivenessWithConfigService(
      projectConfigs,
      this.db,
    )

    const transactions = await livenessWithConfig.getWithinTimeRange(from, to)
    if (!transactions.length) {
      return undefined
    }

    const finalityDelays = []
    const batchedTransactions = chunk(transactions, 10)

    for (const batch of batchedTransactions) {
      const delays = await Promise.all(
        batch.map(
          async (tx) =>
            ({
              l1Timestamp: tx.timestamp.toNumber(),
              l2Blocks: await this.analyze({
                txHash: tx.txHash,
                timestamp: tx.timestamp,
              }),
            }) satisfies Batch,
        ),
      )
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
  abstract analyze(transaction: Transaction): Promise<L2Block[]>
}

export function batchToTimeToInclusionDelays(batch: Batch): number[] {
  return batch.l2Blocks.map((l2Block) => batch.l1Timestamp - l2Block.timestamp)
}

export function batchesToStateUpdateDelays(
  t2iBatches: Batch[],
  suBatches: Batch[],
): number[] {
  return []
}
