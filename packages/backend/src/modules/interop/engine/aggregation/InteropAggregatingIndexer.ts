import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import type { InteropAggregationQualityGate } from './InteropAggregationQualityGate'
import type { InteropAggregationService } from './InteropAggregationService'

export interface InteropAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  configs: InteropAggregationConfig[]
  aggregationService: InteropAggregationService
  qualityGate: InteropAggregationQualityGate
  qualityGateEnabled: boolean
  autoPromotionEnabled: boolean
}

export class InteropAggregatingIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: InteropAggregatingIndexerDeps,
    logger: Logger,
  ) {
    super({ ...$, name: 'interop_aggregating' }, logger)
  }

  override async update(_: number, to: number): Promise<number> {
    const from = to - UnixTime.DAY

    const transfers = await this.$.db.interopTransfer.getByRange(from, to)

    const { aggregatedTransfers, aggregatedTokens } =
      this.$.aggregationService.aggregate(transfers, this.$.configs, to)

    const gateState = await this.$.qualityGate.evaluate(to, aggregatedTransfers)
    const isPromoted =
      !this.$.qualityGateEnabled ||
      this.$.autoPromotionEnabled ||
      gateState.autoPromoted

    await this.$.db.transaction(async () => {
      await this.$.db.aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.insertMany(aggregatedTransfers)
      await this.$.db.aggregatedInteropToken.insertMany(aggregatedTokens)
      await this.$.db.interopAggregationQuality.upsert({
        timestamp: to,
        autoPromoted: gateState.autoPromoted,
        isPromoted,
        promotionRequired: gateState.promotionRequired,
        reasons: gateState.reasons,
        checkedGroups: gateState.checkedGroups,
        failingGroups: gateState.failingGroups,
      })
    })

    if (!isPromoted && gateState.promotionRequired) {
      this.logger.error('Interop aggregation quality gate blocked timestamp', {
        timestamp: to,
        checkedGroups: gateState.checkedGroups,
        failingGroups: gateState.failingGroups,
        reasons: gateState.reasons,
      })
      // TODO: Notify
    }

    this.logger.info('Aggregated interop transfers saved to db', {
      aggregatedRecords: aggregatedTransfers.length,
      aggregatedTokens: aggregatedTokens.length,
      autoPromoted: gateState.autoPromoted,
      isPromoted,
      promotionRequired: gateState.promotionRequired,
      qualityGateEnabled: this.$.qualityGateEnabled,
      autoPromotionEnabled: this.$.autoPromotionEnabled,
      checkedGroups: gateState.checkedGroups,
      failingGroups: gateState.failingGroups,
      reasons: gateState.reasons,
    })

    return to
  }

  // Invalidate on every restart
  override invalidate(_: number): Promise<number> {
    return Promise.resolve(0)
  }
}
