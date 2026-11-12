import type { Logger } from '@l2beat/backend-tools'
import type { Database, EthereumStakingDailyRecord } from '@l2beat/database'
import type { BeaconChainClient } from '@l2beat/shared'
import { slotAt, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { ELECTRA_SLOT, SUPPORTED_FORK_VERSIONS } from '../ethereumForks'
import type { EthereumBlockFinder } from '../types'
import { type DepositsRpc, readCreditedDeposits } from './creditedDeposits'
import type { ExecutionDay } from './dune/readExecutionDay'

/**
 * Validators that earn nothing: those waiting to enter, and those exited but
 * not yet withdrawn. Withdrawn ones hold nothing, and listing them would be
 * most of the state.
 */
const INACTIVE_STATUSES = [
  'pending_initialized',
  'pending_queued',
  'exited_unslashed',
  'exited_slashed',
  'withdrawal_possible',
]

/**
 * A change re-reads every day from the start: a Dune query and seven beacon
 * reads per day, about 100 Dune credits since 2024. Bump it when a fix changes
 * what past days store.
 */
const STORED_DATA_VERSION = '1'

interface EthereumStakingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  /** The first day stored. */
  firstDay: UnixTime
  db: Database
  rpc: DepositsRpc
  readExecutionDay: (
    day: UnixTime,
    fromBlock: number,
    toBlock: number,
  ) => Promise<ExecutionDay>
  beacon: Pick<
    BeaconChainClient,
    | 'getTotalBalance'
    | 'getValidatorsInfo'
    | 'getPendingDepositsAmount'
    | 'getForkVersion'
    | 'getDepositIndex'
  >
  blockFinder: EthereumBlockFinder
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
        minHeight: $.firstDay + UnixTime.DAY,
        configHash: STORED_DATA_VERSION,
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
    // Day boundaries never fall on a slot start, so these are the slots before.
    const slot = slotAt(day)
    const nextSlot = slotAt(UnixTime(day + UnixTime.DAY))
    for (const forkVersion of await Promise.all([
      this.$.beacon.getForkVersion(slot),
      this.$.beacon.getForkVersion(nextSlot),
    ])) {
      if (!SUPPORTED_FORK_VERSIONS.includes(forkVersion)) {
        throw new Error('Unsupported Ethereum fork', {
          cause: { day, forkVersion },
        })
      }
    }
    const [
      totalBalance,
      inactiveBalance,
      pendingDeposits,
      startDepositIndex,
      endDepositIndex,
      fromBlock,
      nextDayBlock,
    ] = await Promise.all([
      this.$.beacon.getTotalBalance(slot),
      this.$.beacon
        .getValidatorsInfo(slot, INACTIVE_STATUSES)
        .then((validators) => validators.totalStake),
      slot >= ELECTRA_SLOT
        ? this.$.beacon.getPendingDepositsAmount(slot)
        : Promise.resolve(null),
      this.$.beacon.getDepositIndex(slot),
      this.$.beacon.getDepositIndex(nextSlot),
      this.firstBlockAtOrAfter(day),
      this.firstBlockAtOrAfter(UnixTime(day + UnixTime.DAY)),
    ])
    const toBlock = nextDayBlock - 1
    const [execution, deposits] = await Promise.all([
      this.$.readExecutionDay(day, fromBlock, toBlock),
      readCreditedDeposits(
        this.$.rpc,
        { from: fromBlock, to: toBlock },
        { start: startDepositIndex, end: endDepositIndex },
      ),
    ])

    return {
      timestamp: day,
      slot,
      totalBalance,
      activeBalance: totalBalance - inactiveBalance,
      pendingDeposits,
      deposits,
      ...execution,
    }
  }

  private async firstBlockAtOrAfter(timestamp: UnixTime): Promise<number> {
    return (await this.$.blockFinder.getBlockNumberAtOrBefore(timestamp)) + 1
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.ethereumStakingDaily.deleteAfter(
      UnixTime(targetHeight - UnixTime.DAY),
    )
    return targetHeight
  }
}
