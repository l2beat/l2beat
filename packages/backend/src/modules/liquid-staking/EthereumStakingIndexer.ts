import type { Logger } from '@l2beat/backend-tools'
import type { Database, EthereumStakingDailyRecord } from '@l2beat/database'
import type { BeaconChainClient, BlockTimestampProvider } from '@l2beat/shared'
import { slotAt, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'
import { type ExecutionDayRpc, readExecutionDay } from './ethereumExecutionDay'

/** First slot of Electra (epoch 364032), which added the pending deposit queue. */
const ELECTRA_SLOT = 364032 * 32

interface EthereumStakingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  rpc: ExecutionDayRpc
  beacon: Pick<
    BeaconChainClient,
    'getTotalBalance' | 'getPendingDepositsAmount'
  >
  blockTimestampProvider: Pick<
    BlockTimestampProvider,
    'getBlockNumberAtOrBefore'
  >
}

/**
 * One row per finished UTC day: the beacon state as the day starts, and what
 * the day's execution blocks paid out. A height is the end of the last stored
 * day, so the day is complete when it is written.
 */
export class EthereumStakingIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: EthereumStakingIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.ETHEREUM_STAKING,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, _to: number): Promise<number> {
    const end = UnixTime.toEndOf(UnixTime(from), 'day')
    const record = await withCoreFeatureRpcMetricsContext(
      'liquidStaking.network',
      { chain: 'ethereum' },
      () => this.readDay(UnixTime(end - UnixTime.DAY)),
    )

    await this.$.db.ethereumStakingDaily.upsertMany([record])
    this.logger.info('Saved Ethereum staking day', {
      day: record.timestamp,
      blocks: record.blockCount,
    })
    return end
  }

  private async readDay(day: UnixTime): Promise<EthereumStakingDailyRecord> {
    // Day boundaries never fall on a slot start, so this is the slot before.
    const slot = slotAt(day)
    const [totalBalance, pendingDeposits, fromBlock, nextDayBlock] =
      await Promise.all([
        this.$.beacon.getTotalBalance(slot),
        slot >= ELECTRA_SLOT
          ? this.$.beacon.getPendingDepositsAmount(slot)
          : Promise.resolve(null),
        this.firstBlockAtOrAfter(day),
        this.firstBlockAtOrAfter(UnixTime(day + UnixTime.DAY)),
      ])
    const execution = await readExecutionDay(
      this.$.rpc,
      fromBlock,
      nextDayBlock - 1,
    )

    return {
      timestamp: day,
      slot,
      totalBalance,
      pendingDeposits,
      ...execution,
    }
  }

  private async firstBlockAtOrAfter(timestamp: UnixTime): Promise<number> {
    return (
      (await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
        timestamp,
        'ethereum',
      )) + 1
    )
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // A day is stored once its end is reached, so keep those ending by the target.
    await this.$.db.ethereumStakingDaily.deleteAfter(
      UnixTime(targetHeight - UnixTime.DAY),
    )
    return targetHeight
  }
}
