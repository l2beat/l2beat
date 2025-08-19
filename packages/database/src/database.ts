import type { LogConfig } from 'kysely'
import type { PoolConfig } from 'pg'
import { ActivityRepository } from './activity/repository'
import { BlobsRepository } from './da-beat/blob/repository'
import { CurrentPriceRepository } from './da-beat/current-price/repository'
import { DataAvailabilityRepository } from './da-beat/data-availability/repository'
import { StakeRepository } from './da-beat/stake/repository'
import { DiscoveryCacheRepository } from './discovery/discovery-cache/repository'
import { FlatSourcesRepository } from './discovery/flat-sources/repository'
import { UpdateDiffRepository } from './discovery/update-diff/repository'
import { UpdateMessageRepository } from './discovery/update-message/repository'
import { UpdateMonitorRepository } from './discovery/update-monitor/repository'
import { UpdateNotifierRepository } from './discovery/update-notifier/repository'
import { DatabaseClient } from './kysely'
import { AggregatedL2CostRepository } from './other/aggregated-l2-cost/repository'
import { AggregatedLivenessRepository } from './other/aggregated-liveness/repository'
import { AnomaliesRepository } from './other/anomalies/repository'
import { AnomalyStatsRepository } from './other/anomaly-stats/repository'
import { L2CostRepository } from './other/l2-cost/repository'
import { L2CostPriceRepository } from './other/l2-cost-price/repository'
import { LivenessRepository } from './other/liveness/repository'
import { NotificationsRepository } from './other/notifications/repository'
import { RealTimeAnomaliesRepository } from './other/real-time-anomalies/repository'
import { RealTimeLivenessRepository } from './other/real-time-liveness/repository'
import { VerifierStatusRepository } from './other/verifier-status/repository'
import { TvsAmountRepository } from './tvs/amount/repository'
import { TvsBlockTimestampRepository } from './tvs/block-timestamp/repository'
import { TvsPriceRepository } from './tvs/price/repository'
import { ProjectValueRepository } from './tvs/project-value/repository'
import { TokenValueRepository } from './tvs/token-value/repository'
import { IndexerConfigurationRepository } from './uif/indexer-configuration/repository'
import { IndexerStateRepository } from './uif/indexer-state/repository'
import { getDatabaseStats } from './utils/getDatabaseStats'

export type Database = ReturnType<typeof createDatabase>
export function createDatabase(config?: PoolConfig & { log?: LogConfig }) {
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
    blobs: new BlobsRepository(db),
    // #endregion

    // #region Discovery
    discoveryCache: new DiscoveryCacheRepository(db),
    updateDiff: new UpdateDiffRepository(db),
    updateMonitor: new UpdateMonitorRepository(db),
    updateNotifier: new UpdateNotifierRepository(db),
    updateMessage: new UpdateMessageRepository(db),
    flatSources: new FlatSourcesRepository(db),
    // #endregion

    // #region UIF
    indexerConfiguration: new IndexerConfigurationRepository(db),
    indexerState: new IndexerStateRepository(db),
    // #endregion

    // #region Other
    aggregatedL2Cost: new AggregatedL2CostRepository(db),
    aggregatedLiveness: new AggregatedLivenessRepository(db),
    anomalies: new AnomaliesRepository(db),
    realTimeAnomalies: new RealTimeAnomaliesRepository(db),
    anomalyStats: new AnomalyStatsRepository(db),
    l2Cost: new L2CostRepository(db),
    l2CostPrice: new L2CostPriceRepository(db),
    liveness: new LivenessRepository(db),
    realTimeLiveness: new RealTimeLivenessRepository(db),
    verifierStatus: new VerifierStatusRepository(db),
    // #endregion
    //
    // #region Tvs
    tvsPrice: new TvsPriceRepository(db),
    tvsAmount: new TvsAmountRepository(db),
    tvsBlockTimestamp: new TvsBlockTimestampRepository(db),
    tvsTokenValue: new TokenValueRepository(db),
    tvsProjectValue: new ProjectValueRepository(db),
    // #endregion
    notifications: new NotificationsRepository(db),
    // #region
    stats: () => getDatabaseStats(db),
    // #endregion
  }
}
