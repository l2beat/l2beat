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

interface ArchiveDateRange {
  from: UnixTime | undefined
  to: UnixTime
}
interface ArchivableRepository {
  deleteHourlyUntil(dateRange: ArchiveDateRange): Promise<number>
  deleteSixHourlyUntil(dateRange: ArchiveDateRange): Promise<number>
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
    const repositories = {
      tokenValue: this.$.db.tvsTokenValue,
      blockTimestamp: this.$.db.tvsBlockTimestamp,
      amount: this.$.db.tvsAmount,
      price: this.$.db.tvsPrice,
    } satisfies Record<string, ArchivableRepository>

    const [
      tokenValueHourlyDeletedRecords,
      blockTimestampHourlyDeletedRecords,
      amountHourlyDeletedRecords,
      priceHourlyDeletedRecords,
    ] = await Promise.all([
      repositories.tokenValue.deleteHourlyUntil(hourlyRange),
      repositories.blockTimestamp.deleteHourlyUntil(hourlyRange),
      repositories.amount.deleteHourlyUntil(hourlyRange),
      repositories.price.deleteHourlyUntil(hourlyRange),
    ])
    const [
      tokenValueSixHourlyDeletedRecords,
      blockTimestampSixHourlyDeletedRecords,
      amountSixHourlyDeletedRecords,
      priceSixHourlyDeletedRecords,
    ] = await Promise.all([
      repositories.tokenValue.deleteSixHourlyUntil(sixHourlyRange),
      repositories.blockTimestamp.deleteSixHourlyUntil(sixHourlyRange),
      repositories.amount.deleteSixHourlyUntil(sixHourlyRange),
      repositories.price.deleteSixHourlyUntil(sixHourlyRange),
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

    return to
  }

  override invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
