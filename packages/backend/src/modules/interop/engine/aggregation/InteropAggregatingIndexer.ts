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
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import type {
  InteropAggregationAnalysis,
  InteropAggregationAnalyzer,
} from './InteropAggregationAnalyzer'
import type { InteropAggregationService } from './InteropAggregationService'

export interface InteropAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  configs: InteropAggregationConfig[]
  aggregationService: InteropAggregationService
  aggregationAnalyzer?: InteropAggregationAnalyzer
  notifier?: Pick<InteropNotifier, 'notifySuspiciousAggregates'>
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
    if (!this.$.syncersManager.areAllSyncersFollowing()) {
      this.logger.info(
        'Skipping aggregation - not all syncers are following the tip',
      )
      // This is a deliberate no-op: aggregates are best-effort hourly snapshots.
      // If syncers are behind, we leave this hour empty and try again next hour.
      return to
    }

    const from = to - UnixTime.DAY

    const transfers = await this.$.db.interopTransfer.getByRange(from, to)

    const { aggregatedTransfers, aggregatedTokens, aggregatedTokensPairs } =
      this.$.aggregationService.aggregate(transfers, this.$.configs, to)
    const analysis = await this.runAggregateAnalysis(to, aggregatedTransfers)

    await this.$.db.transaction(async () => {
      await this.$.db.aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropTokensPair.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTokensPair.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.insertMany(aggregatedTransfers)
      await this.$.db.aggregatedInteropToken.insertMany(aggregatedTokens)
      await this.$.db.aggregatedInteropTokensPair.insertMany(
        aggregatedTokensPairs,
      )
    })

    if (analysis && analysis.suspiciousGroups.length > 0) {
      this.logger.warn('Suspicious interop aggregates detected', {
        timestamp: to,
        checkedGroups: analysis.checkedGroups,
        suspiciousGroups: analysis.suspiciousGroups.length,
        details: analysis.suspiciousGroups,
      })
      this.$.notifier?.notifySuspiciousAggregates(to, analysis)
    }

    this.logger.info('Aggregated interop transfers saved to db', {
      aggregatedRecords: aggregatedTransfers.length,
      aggregatedTokens: aggregatedTokens.length,
      aggregatedTokenPairs: aggregatedTokensPairs.length,
      suspiciousGroups: analysis?.suspiciousGroups.length ?? 0,
    })

    return to
  }

  private async runAggregateAnalysis(
    timestamp: UnixTime,
    aggregatedTransfers: AggregatedInteropTransferRecord[],
  ): Promise<InteropAggregationAnalysis | undefined> {
    if (!this.$.aggregationAnalyzer) {
      return undefined
    }

    try {
      return await this.$.aggregationAnalyzer.analyze(
        timestamp,
        aggregatedTransfers,
      )
    } catch (error) {
      this.logger.error('Failed to analyze interop aggregates', {
        timestamp,
        error,
      })
      return undefined
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
