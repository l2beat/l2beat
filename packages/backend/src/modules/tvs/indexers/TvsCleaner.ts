import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import type { SyncOptimizer } from '../tools/SyncOptimizer'

export interface TvsCleanerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  syncOptimizer: SyncOptimizer
}

export class TvsCleaner extends ManagedChildIndexer {
  constructor(
    private readonly $: TvsCleanerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.TVS_CLEANER,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    const adjustedFrom = from !== 0 ? (from - 1) * UnixTime.DAY : undefined
    const adjustedTo = UnixTime(to * UnixTime.DAY)
    const hourlyRange = {
      from: adjustedFrom
        ? this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(adjustedFrom)
        : undefined,
      to: this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(adjustedTo),
    }
    const sixHourlyRange = {
      from: adjustedFrom
        ? this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(adjustedFrom)
        : undefined,
      to: this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(adjustedTo),
    }

    await this.$.db.transaction(async () => {
      const tokenValueHourlyDeletedRecords =
        await this.$.db.tvsTokenValue.deleteHourlyUntil(hourlyRange)
      const blockTimestampHourlyDeletedRecords =
        await this.$.db.tvsBlockTimestamp.deleteHourlyUntil(hourlyRange)
      const amountHourlyDeletedRecords =
        await this.$.db.tvsAmount.deleteHourlyUntil(hourlyRange)
      const priceHourlyDeletedRecords =
        await this.$.db.tvsPrice.deleteHourlyUntil(hourlyRange)

      const tokenValueSixHourlyDeletedRecords =
        await this.$.db.tvsTokenValue.deleteSixHourlyUntil(sixHourlyRange)
      const blockTimestampSixHourlyDeletedRecords =
        await this.$.db.tvsBlockTimestamp.deleteSixHourlyUntil(sixHourlyRange)
      const amountSixHourlyDeletedRecords =
        await this.$.db.tvsAmount.deleteSixHourlyUntil(sixHourlyRange)
      const priceSixHourlyDeletedRecords =
        await this.$.db.tvsPrice.deleteSixHourlyUntil(sixHourlyRange)

      this.logger.info('Cleaned TVS records', {
        until: adjustedTo,
        tokenValueHourlyDeletedRecords,
        blockTimestampHourlyDeletedRecords,
        amountHourlyDeletedRecords,
        priceHourlyDeletedRecords,
        tokenValueSixHourlyDeletedRecords,
        blockTimestampSixHourlyDeletedRecords,
        amountSixHourlyDeletedRecords,
        priceSixHourlyDeletedRecords,
      })
    })

    return to
  }

  override invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
