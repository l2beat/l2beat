import {
  assert,
  type ProjectId,
  type TrackedTxsConfigSubtype,
  type UnixTime,
  slidingWindow,
} from '@l2beat/shared-pure'
import { chunk } from 'lodash'

import type { Database } from '@l2beat/database'
import { LivenessWithConfigService } from '../../../tracked-txs/modules/liveness/services/LivenessWithConfigService'

import type { RpcClient } from '@l2beat/shared'
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

    // NOTE(radomski): We only want the range to be for a single day, but to
    // get ability to look back a single tx we need to query more. We're going
    // to assume that we will find at least one entry before our interval at
    // least one before.
    const fromSafe = from.add(-1, 'days')
    const safeTransactions = await livenessWithConfig.getWithinTimeRange(
      fromSafe,
      to,
    )

    if (!safeTransactions.length) {
      return undefined
    }

    const sortedSafeTransactions = safeTransactions.sort(
      (tx1, tx2) => tx1.timestamp.toNumber() - tx2.timestamp.toNumber(),
    )
    const firstInRange = sortedSafeTransactions.findIndex((t) =>
      t.timestamp.gte(from),
    )

    assert(firstInRange !== 0, 'Assumption from above comment is not met')

    if (firstInRange === -1) {
      return undefined
    }
    const transactions = sortedSafeTransactions.slice(firstInRange - 1)
    const windowedTransactions = slidingWindow(transactions, 2, 1)

    const finalityBatches = []
    const batchedTransactions = chunk(windowedTransactions, 10)

    for (const batch of batchedTransactions) {
      const batches = await Promise.all(
        batch.map(
          async ([prevTx, tx]) =>
            ({
              l1Timestamp: tx.timestamp.toNumber(),
              l2Blocks: await this.analyze(
                { txHash: prevTx.txHash, timestamp: tx.timestamp },
                { txHash: tx.txHash, timestamp: tx.timestamp },
              ),
            }) satisfies Batch,
        ),
      )
      finalityBatches.push(batches.flat())
    }

    return finalityBatches.flat()
  }

  abstract getTrackedTxSubtype(): TrackedTxsConfigSubtype

  /**
   *
   * @param transaction
   * @returns array of L2Block number and timestamp
   */
  abstract analyze(
    previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]>
}

export function batchToTimeToInclusionDelays(batch: Batch): number[] {
  return batch.l2Blocks.map((l2Block) => batch.l1Timestamp - l2Block.timestamp)
}

export function batchesToStateUpdateDelays(
  t2iBatches: Batch[],
  suBatches: Batch[],
): number[] {
  let oldestBlock: L2Block | undefined = t2iBatches[0]?.l2Blocks[0]
  let newestBlock: L2Block | undefined = t2iBatches[0]?.l2Blocks[0]

  const map: Map<number, number> = new Map()
  for (const batch of t2iBatches) {
    for (const l2Block of batch.l2Blocks) {
      if (!oldestBlock || oldestBlock.blockNumber > l2Block.blockNumber) {
        oldestBlock = l2Block
      }
      if (!newestBlock || newestBlock.blockNumber < l2Block.blockNumber) {
        newestBlock = l2Block
      }

      map.set(l2Block.blockNumber, batch.l1Timestamp)
    }
  }

  const getL2BlockTimestamp = (l2BlockNumber: number): number => {
    if (oldestBlock && oldestBlock.blockNumber > l2BlockNumber) {
      return oldestBlock.timestamp
    }

    if (newestBlock && newestBlock.blockNumber < l2BlockNumber) {
      return newestBlock.timestamp
    }

    return (
      map.get(l2BlockNumber) ??
      lerp(
        oldestBlock.timestamp,
        newestBlock.timestamp,
        (l2BlockNumber - oldestBlock.blockNumber) /
          (newestBlock.blockNumber - oldestBlock.blockNumber),
      )
    )
  }

  return suBatches.flatMap((b) =>
    b.l2Blocks.map((l2Block) => {
      const l1Timestamp = b.l1Timestamp
      const l2Timestamp = getL2BlockTimestamp(l2Block.blockNumber)
      return l1Timestamp - l2Timestamp
    }),
  )
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
