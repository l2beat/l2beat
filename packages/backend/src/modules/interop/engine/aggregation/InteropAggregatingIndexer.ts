import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import type { InteropAggregationService } from './InteropAggregationService'

export interface InteropAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  configs: InteropAggregationConfig[]
  aggregationService: InteropAggregationService
}

export class InteropAggregatingIndexer extends ManagedChildIndexer {
  constructor(private readonly $: InteropAggregatingIndexerDeps) {
    super({ ...$, name: 'interop_aggregating' })
  }

  override async update(_: number, to: number): Promise<number> {
    const from = to - UnixTime.DAY

    const transfers = await this.$.db.interopTransfer.getByRange(from, to)

    const { aggregatedTransfers, aggregatedTokens } =
      this.$.aggregationService.aggregate(transfers, this.$.configs, to)

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
    })
    this.logger.info('Aggregated interop transfers saved to db', {
      aggregatedRecords: aggregatedTransfers.length,
      aggregatedTokens: aggregatedTokens.length,
    })

    return to
  }

  // Invalidate on every restart
  override invalidate(_: number): Promise<number> {
    return Promise.resolve(0)
  }
}
