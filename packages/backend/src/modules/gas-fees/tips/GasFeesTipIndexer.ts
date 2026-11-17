import type { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesTipHourlyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import type { BlockFinder } from '../types'
import { estimateTips, HISTORY_BLOCKS } from './estimateTips'
import {
  type BlockTimestampRpc,
  findLastBlocksBefore,
} from './findLastBlocksBefore'
import { type FeeHistoryRpc, readBlockTips } from './readBlockTips'
import { type EthUsdRpc, readEthUsd } from './readEthUsd'

/** Bump it when the estimator changes: every hour is read again, from blocks over RPC */
const STORED_DATA_VERSION = '1'
/** A day's blocks take about 9 eth_feeHistory calls */
const HOURS_PER_UPDATE = 24

interface GasFeesTipIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  firstHour: UnixTime
  db: Database
  rpc: FeeHistoryRpc & EthUsdRpc & BlockTimestampRpc
  blockFinder: BlockFinder
}

/**
 * Our estimator's tips as of the start of each hour, from the blocks before
 * it, so any past hour can be read again. A height is the last stored hour.
 */
export class GasFeesTipIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: GasFeesTipIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.GAS_FEES_TIPS,
        minHeight: $.firstHour,
        configHash: `${STORED_DATA_VERSION}:${$.firstHour}`,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    const hours: UnixTime[] = []
    for (
      let hour = UnixTime.toEndOf(UnixTime(from), 'hour');
      hour <= to && hours.length < HOURS_PER_UPDATE;
      hour = UnixTime(hour + UnixTime.HOUR)
    ) {
      hours.push(hour)
    }
    const lastHour = hours.at(-1)
    if (lastHour === undefined) return to

    const blocks = await findLastBlocksBefore(
      this.$.blockFinder,
      this.$.rpc,
      hours,
    )
    const firstBlock = (blocks[0] ?? 0) - HISTORY_BLOCKS + 1
    const lastBlock = blocks.at(-1) ?? 0
    const [tips, prices] = await Promise.all([
      readBlockTips(this.$.rpc, firstBlock, lastBlock),
      Promise.all(blocks.map((block) => readEthUsd(this.$.rpc, block))),
    ])
    const records: GasFeesTipHourlyRecord[] = hours.map((hour, i) => {
      const blockNumber = blocks[i] ?? 0
      const estimate = estimateTips(tips.slice(0, blockNumber - firstBlock + 1))
      return {
        timestamp: hour,
        blockNumber,
        slowTipGwei: estimate.slow,
        mediumTipGwei: estimate.medium,
        fastTipGwei: estimate.fast,
        ethUsd: prices[i] ?? 0,
      }
    })
    await this.$.db.gasFeesTipHourly.upsertMany(records)
    this.logger.info('Saved gas fees tips', {
      from: hours[0],
      hours: hours.length,
    })
    return lastHour
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.gasFeesTipHourly.deleteAfter(UnixTime(targetHeight))
    return targetHeight
  }
}
