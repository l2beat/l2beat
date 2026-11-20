import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { IRpcClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../tools/TimeLoop'
import { BLOCK_PERCENTILES, estimateTips, HISTORY_BLOCKS } from './estimateTips'
import { type FeeHistoryRpc, readBlockTips } from './readBlockTips'
import { type EthUsdRpc, readEthUsd } from './readEthUsd'

/** Each run reads the newest blocks again, in case of a reorg */
const REREAD_BLOCKS = 300

/**
 * Keeps our estimator's tips at the newest block in the database, for the live
 * card. Blocks already read are kept in memory, so a new head costs one
 * eth_feeHistory call.
 */
export class LiveTipsLoop extends TimeLoop {
  /** Each block's tips at BLOCK_PERCENTILES, by block number */
  private readonly blockTips = new Map<number, number[]>()
  private lastHead: number | undefined

  constructor(
    private readonly $: {
      db: Database
      rpc: FeeHistoryRpc & EthUsdRpc & Pick<IRpcClient, 'getLatestBlockNumber'>
      intervalMs: number
    },
    protected logger: Logger,
  ) {
    super({ intervalMs: $.intervalMs })
    this.logger = logger.for(this)
  }

  async run(): Promise<void> {
    const head = await this.$.rpc.getLatestBlockNumber()
    if (head === this.lastHead) return

    const oldest = head - HISTORY_BLOCKS + 1
    for (const number of this.blockTips.keys()) {
      if (number < oldest) this.blockTips.delete(number)
    }
    const rereadFrom = head - REREAD_BLOCKS + 1
    let missingFrom = rereadFrom
    for (let number = oldest; number < rereadFrom; number++) {
      if (!this.blockTips.has(number)) {
        missingFrom = number
        break
      }
    }
    const [tips, ethUsd] = await Promise.all([
      readBlockTips(this.$.rpc, missingFrom, head, BLOCK_PERCENTILES),
      readEthUsd(this.$.rpc, head),
    ])
    tips.forEach((row, i) => this.blockTips.set(missingFrom + i, row))

    const window: number[][] = []
    for (let number = oldest; number <= head; number++) {
      const row = this.blockTips.get(number)
      if (row) window.push(row)
    }
    const estimate = estimateTips(window)
    await this.$.db.gasFeesLiveTips.replace({
      blockNumber: head,
      slowTipGwei: estimate.slow,
      mediumTipGwei: estimate.medium,
      fastTipGwei: estimate.fast,
      ethUsd,
      updatedAt: UnixTime.now(),
    })
    this.lastHead = head
  }
}
