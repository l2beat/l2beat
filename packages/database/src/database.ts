import type { PoolConfig } from 'pg'
import { ActivityRepository } from './activity/repository'
import { CurrentPriceRepository } from './da-beat/current-price/repository'
import { DataAvailabilityRepository } from './da-beat/data-availability/repository'
import { StakeRepository } from './da-beat/stake/repository'
import { DiscoveryCacheRepository } from './discovery/discovery-cache/repository'
import { FlatSourcesRepository } from './discovery/flat-sources/repository'
import { UpdateMessageRepository } from './discovery/update-message/repository'
import { UpdateMonitorRepository } from './discovery/update-monitor/repository'
import { UpdateNotifierRepository } from './discovery/update-notifier/repository'
import { DatabaseClient } from './kysely'
import { AggregatedL2CostRepository } from './other/aggregated-l2-cost/repository'
import { AggregatedLivenessRepository } from './other/aggregated-liveness/repository'
import { AnomaliesRepository } from './other/anomalies/repository'
import { FinalityRepository } from './other/finality/repository'
import { L2CostPriceRepository } from './other/l2-cost-price/repository'
import { L2CostRepository } from './other/l2-cost/repository'
import { LivenessRepository } from './other/liveness/repository'
import { VerifierStatusRepository } from './other/verifier-status/repository'
import { AmountRepository } from './tvl/amount/repository'
import { BlockTimestampRepository } from './tvl/block-timestamp/repository'
import { PriceRepository } from './tvl/price/repository'
import { TvlCleanerRepository } from './tvl/tvl-cleaner/repository'
import { ValueRepository } from './tvl/value/repository'
import { IndexerConfigurationRepository } from './uif/indexer-configuration/repository'
import { IndexerStateRepository } from './uif/indexer-state/repository'

export type Database = ReturnType<typeof createDatabase>
export function createDatabase(config?: PoolConfig) {
  const db = new DatabaseClient({ ...config })

  return {
    transaction: db.transaction.bind(db),
    close: db.close.bind(db),

    // #region Activity
    activity: new ActivityRepository(db),
    // #endregion

    // #region DA BEAT
    currentPrice: new CurrentPriceRepository(db),
    stake: new StakeRepository(db),
    dataAvailability: new DataAvailabilityRepository(db),
    // #endregion

    // #region Discovery
    discoveryCache: new DiscoveryCacheRepository(db),
    updateMonitor: new UpdateMonitorRepository(db),
    updateNotifier: new UpdateNotifierRepository(db),
    updateMessage: new UpdateMessageRepository(db),
    flatSources: new FlatSourcesRepository(db),
    // #endregion

    // #region TVL
    amount: new AmountRepository(db),
    blockTimestamp: new BlockTimestampRepository(db),
    price: new PriceRepository(db),
    tvlCleaner: new TvlCleanerRepository(db),
    value: new ValueRepository(db),
    // #endregion

    // #region UIF
    indexerConfiguration: new IndexerConfigurationRepository(db),
    indexerState: new IndexerStateRepository(db),
    // #endregion

    // #region Other
    aggregatedL2Cost: new AggregatedL2CostRepository(db),
    aggregatedLiveness: new AggregatedLivenessRepository(db),
    anomalies: new AnomaliesRepository(db),
    finality: new FinalityRepository(db),
    l2Cost: new L2CostRepository(db),
    l2CostPrice: new L2CostPriceRepository(db),
    liveness: new LivenessRepository(db),
    verifierStatus: new VerifierStatusRepository(db),
    // #endregion
  }
}
