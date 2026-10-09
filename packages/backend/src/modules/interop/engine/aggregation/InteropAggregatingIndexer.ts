import type { Logger } from '@l2beat/backend-tools'
import type {
  AggregatedInteropTransferRecord,
  Database,
} from '@l2beat/database'
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
import type {
  AggregationResult,
  InteropAggregationService,
} from './InteropAggregationService'
import {
  type ClusterMembers,
  carryForwardStaleLanes,
  getStaleChainsByProject,
  type StaleChainsByProject,
} from './staleLanes'

/**
 * How stale the syncers' captured data may be relative to the aggregation
 * window end before its lanes are carried forward instead of aggregated. `to`
 * is the last whole hour (already up to an hour in the past), so a syncer must
 * lag by more than this plus that gap to trip the check.
 */
export const SYNCER_FRESHNESS_TOLERANCE = 30 * UnixTime.MINUTE

export interface InteropAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  configs: InteropAggregationConfig[]
  /** Maps plugin names to the syncing cluster they belong to. */
  pluginClusters: ClusterMembers[]
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
    const blockers = await this.$.syncersManager.getAggregationBlockers(
      to,
      SYNCER_FRESHNESS_TOLERANCE,
    )
    const staleChains = getStaleChainsByProject(
      this.$.configs,
      this.$.pluginClusters,
      blockers,
    )

    const from = to - UnixTime.DAY
    const retentionCutoff = to - 14 * UnixTime.DAY

    const transfers = await this.$.db.interopTransfer.getByRange(from, to)

    const fresh = this.$.aggregationService.aggregate(
      transfers,
      this.$.configs,
      to,
    )
    const {
      aggregatedTransfers,
      aggregatedTokens,
      aggregatedDeployedTokens,
      aggregatedTokensPairs,
    } =
      staleChains.size > 0
        ? await this.withStaleLanesCarriedForward(fresh, staleChains, to)
        : fresh

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
      carriedForwardLanes: aggregatedTransfers.filter((t) => t.carriedFrom)
        .length,
      aggregatedTokens: aggregatedTokens.length,
      aggregatedDeployedTokens: aggregatedDeployedTokens.length,
      aggregatedTokenPairs: aggregatedTokensPairs.length,
    })

    return to
  }

  /**
   * Stale lanes would show a drop in activity that is really a capture lag, so
   * they are replaced by the previous snapshot's rows re-stamped to this hour.
   * Transfers remember the snapshot they were copied from; the other tables
   * are detail rows keyed by the same lane and inherit that marker through it.
   */
  private async withStaleLanesCarriedForward(
    fresh: AggregationResult,
    staleChains: StaleChainsByProject,
    to: UnixTime,
  ): Promise<AggregationResult> {
    const previousTimestamp =
      await this.$.db.aggregatedInteropTransfer.getMaxTimestampAtOrBefore(
        to - 1,
      )
    this.logger.warn('Carrying stale lanes forward from previous snapshot', {
      previousTimestamp,
      staleChainsByProject: Object.fromEntries(
        [...staleChains].map(([id, chains]) => [id, [...chains]]),
      ),
    })
    const previous =
      previousTimestamp === undefined
        ? EMPTY_SNAPSHOT
        : await this.loadSnapshot(previousTimestamp)

    return {
      aggregatedTransfers: carryForwardStaleLanes(
        fresh.aggregatedTransfers,
        previous.aggregatedTransfers.map(markCarriedFrom),
        staleChains,
        to,
      ),
      aggregatedTokens: carryForwardStaleLanes(
        fresh.aggregatedTokens,
        previous.aggregatedTokens,
        staleChains,
        to,
      ),
      aggregatedDeployedTokens: carryForwardStaleLanes(
        fresh.aggregatedDeployedTokens,
        previous.aggregatedDeployedTokens,
        staleChains,
        to,
      ),
      aggregatedTokensPairs: carryForwardStaleLanes(
        fresh.aggregatedTokensPairs,
        previous.aggregatedTokensPairs,
        staleChains,
        to,
      ),
    }
  }

  private async loadSnapshot(timestamp: UnixTime): Promise<AggregationResult> {
    const [
      aggregatedTransfers,
      aggregatedTokens,
      aggregatedDeployedTokens,
      aggregatedTokensPairs,
    ] = await Promise.all([
      this.$.db.aggregatedInteropTransfer.getByTimestamp(timestamp),
      this.$.db.aggregatedInteropToken.getByTimestamp(timestamp),
      this.$.db.aggregatedInteropDeployedToken.getByTimestamp(timestamp),
      this.$.db.aggregatedInteropTokensPair.getByTimestamp(timestamp),
    ])
    return {
      aggregatedTransfers,
      aggregatedTokens,
      aggregatedDeployedTokens,
      aggregatedTokensPairs,
    }
  }

  isAggregationInProgress(): boolean {
    return this.getState().status === 'updating'
  }

  // Invalidate on every restart
  override invalidate(_: number): Promise<number> {
    return Promise.resolve(0)
  }
}

const EMPTY_SNAPSHOT: AggregationResult = {
  aggregatedTransfers: [],
  aggregatedTokens: [],
  aggregatedDeployedTokens: [],
  aggregatedTokensPairs: [],
}

/** A lane carried more than once keeps pointing at the snapshot it was last computed in. */
function markCarriedFrom(
  row: AggregatedInteropTransferRecord,
): AggregatedInteropTransferRecord {
  return { ...row, carriedFrom: row.carriedFrom ?? row.timestamp }
}
