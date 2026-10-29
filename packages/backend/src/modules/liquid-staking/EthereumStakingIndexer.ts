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
import {
  type DepositsRpc,
  ELECTRA_SLOT,
  readCreditedDeposits,
} from './creditedDeposits'
import { type ExecutionDayRpc, readExecutionDay } from './ethereumExecutionDay'

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

interface EthereumStakingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  rpc: ExecutionDayRpc & DepositsRpc
  beacon: Pick<
    BeaconChainClient,
    | 'getTotalBalance'
    | 'getValidatorsInfo'
    | 'getPendingDepositsAmount'
    | 'getDepositIndex'
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
    // Day boundaries never fall on a slot start, so these are the slots before.
    const slot = slotAt(day)
    const nextSlot = slotAt(UnixTime(day + UnixTime.DAY))
    const [
      totalBalance,
      inactiveBalance,
      pendingDeposits,
      depositIndex,
      nextDepositIndex,
      fromBlock,
      nextDayBlock,
    ] = await Promise.all([
      this.$.beacon.getTotalBalance(slot),
      this.$.beacon
        .getValidatorsInfo({ stateId: slot, status: INACTIVE_STATUSES })
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
      readExecutionDay(this.$.rpc, fromBlock, toBlock),
      readCreditedDeposits(
        this.$.rpc,
        { from: fromBlock, to: toBlock },
        { start: depositIndex, end: nextDepositIndex },
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
