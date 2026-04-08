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

  override async update(_: number, to: number): Promise<number> {
    const currentTarget = UnixTime(to * UnixTime.DAY)
    const hourlyRange = {
      from: undefined,
      to: this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(currentTarget),
    }
    const sixHourlyRange = {
      from: undefined,
      to: this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(currentTarget),
    }

    await this.$.db.transaction(async () => {
      const [
        tokenValueHourlyDeletedRecords,
        blockTimestampHourlyDeletedRecords,
        amountHourlyDeletedRecords,
        priceHourlyDeletedRecords,
      ] = await Promise.all([
        this.$.db.tvsTokenValue.deleteHourlyUntil(hourlyRange),
        this.$.db.tvsBlockTimestamp.deleteHourlyUntil(hourlyRange),
        this.$.db.tvsAmount.deleteHourlyUntil(hourlyRange),
        this.$.db.tvsPrice.deleteHourlyUntil(hourlyRange),
      ])
      const [
        tokenValueSixHourlyDeletedRecords,
        blockTimestampSixHourlyDeletedRecords,
        amountSixHourlyDeletedRecords,
        priceSixHourlyDeletedRecords,
      ] = await Promise.all([
        this.$.db.tvsTokenValue.deleteSixHourlyUntil(sixHourlyRange),
        this.$.db.tvsBlockTimestamp.deleteSixHourlyUntil(sixHourlyRange),
        this.$.db.tvsAmount.deleteSixHourlyUntil(sixHourlyRange),
        this.$.db.tvsPrice.deleteSixHourlyUntil(sixHourlyRange),
      ])

      this.logger.info('Cleaned TVS records', {
        until: currentTarget,
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
