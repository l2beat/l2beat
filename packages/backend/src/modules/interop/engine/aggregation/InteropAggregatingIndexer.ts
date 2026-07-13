import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import type { InteropNotifier } from '../notifications/InteropNotifier'
import type {
  InteropPromotionService,
  ReconcileResult,
} from '../promotion/InteropPromotionService'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import type { InteropAggregationService } from './InteropAggregationService'

/**
 * How stale the syncers' captured data may be relative to the aggregation
 * window end before we skip the hour. `to` is the last whole hour (already up
 * to an hour in the past), so a syncer must lag by more than this plus that
 * gap to trip the check.
 */
export const SYNCER_FRESHNESS_TOLERANCE = 30 * UnixTime.MINUTE

export interface InteropAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  configs: InteropAggregationConfig[]
  aggregationService: InteropAggregationService
  promotionService: InteropPromotionService
  notifier?: Pick<InteropNotifier, 'notifyBlockedSnapshot'>
  syncersManager: InteropSyncersManager
}

export class InteropAggregatingIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: InteropAggregatingIndexerDeps,
    logger: Logger,
  ) {
    super({ ...$, name: 'interop_aggregating' }, logger)
  }

  override async update(_: number, to: number): Promise<number> {
    const syncersFresh = await this.$.syncersManager.areSyncersFreshEnough(
      to,
      SYNCER_FRESHNESS_TOLERANCE,
    )
    if (!syncersFresh) {
      this.logger.info(
        'Skipping aggregation - syncers captured data is not fresh enough',
      )
      // This is a deliberate no-op: aggregates are best-effort hourly snapshots.
      // If syncers are behind, we leave this hour empty and try again next hour.
      return to
    }

    const from = to - UnixTime.DAY
    const retentionCutoff = to - 14 * UnixTime.DAY

    const transfers = await this.$.db.interopTransfer.getByRange(from, to)

    const {
      aggregatedTransfers,
      aggregatedTokens,
      aggregatedDeployedTokens,
      aggregatedTokensPairs,
    } = this.$.aggregationService.aggregate(transfers, this.$.configs, to)

    let promotion: ReconcileResult | undefined
    await this.$.db.transaction(async () => {
      await this.$.db.aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore(
        retentionCutoff,
      )
      await this.$.db.aggregatedInteropToken.deleteAllButEarliestPerDayBefore(
        retentionCutoff,
      )
      await this.$.db.aggregatedInteropDeployedToken.deleteAllButEarliestPerDayBefore(
        retentionCutoff,
      )
      await this.$.db.aggregatedInteropTokensPair.deleteAllButEarliestPerDayBefore(
        retentionCutoff,
      )
      await this.$.db.aggregatedInteropToken.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropDeployedToken.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTokensPair.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.insertMany(aggregatedTransfers)
      await this.$.db.aggregatedInteropToken.insertMany(aggregatedTokens)
      await this.$.db.aggregatedInteropDeployedToken.insertMany(
        aggregatedDeployedTokens,
      )
      await this.$.db.aggregatedInteropTokensPair.insertMany(
        aggregatedTokensPairs,
      )
      // Evaluate + write this snapshot's promotion status (atomic with the
      // aggregates). The read path is unaffected until the cutover, so a `blocked`
      // verdict only records + alerts for now; it does not change what is served.
      promotion = await this.$.promotionService.reconcile({
        timestamp: to,
        transfers: aggregatedTransfers,
        tokens: aggregatedTokens,
      })
      // Keep status rows in lockstep with the aggregates retention above.
      await this.$.db.interopAggregateStatus.deleteOrphaned()
    })

    if (promotion?.notify) {
      this.$.notifier?.notifyBlockedSnapshot(to, promotion.reasons)
    }

    this.logger.info('Aggregated interop transfers saved to db', {
      aggregatedRecords: aggregatedTransfers.length,
      aggregatedTokens: aggregatedTokens.length,
      aggregatedDeployedTokens: aggregatedDeployedTokens.length,
      aggregatedTokenPairs: aggregatedTokensPairs.length,
    })

    return to
  }

  isAggregationInProgress(): boolean {
    return this.getState().status === 'updating'
  }

  // Invalidate on every restart
  override invalidate(_: number): Promise<number> {
    return Promise.resolve(0)
  }
}
