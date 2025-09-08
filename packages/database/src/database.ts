import type { LogConfig } from 'kysely'
import type { PoolConfig } from 'pg'
import { DatabaseClient } from './kysely'
import { ActivityRepository } from './repositories/ActivityRepository'
import { AggregatedL2CostRepository } from './repositories/AggregatedL2CostRepository'
import { AggregatedLivenessRepository } from './repositories/AggregatedLivenessRepository'
import { AnomaliesRepository } from './repositories/AnomaliesRepository'
import { AnomalyStatsRepository } from './repositories/AnomalyStatsRepository'
import { BlobsRepository } from './repositories/BlobsRepository'
import { BridgeEventRepository } from './repositories/BridgeEventRepository'
import { BridgeMessageRepository } from './repositories/BridgeMessageRepository'
import { CurrentPriceRepository } from './repositories/CurrentPriceRepository'
import { DataAvailabilityRepository } from './repositories/DataAvailabilityRepository'
import { DiscoveryCacheRepository } from './repositories/DiscoveryCacheRepository'
import { FlatSourcesRepository } from './repositories/FlatSourcesRepository'
import { IndexerConfigurationRepository } from './repositories/IndexerConfigurationRepository'
import { IndexerStateRepository } from './repositories/IndexerStateRepository'
import { L2CostPriceRepository } from './repositories/L2CostPriceRepository'
import { L2CostRepository } from './repositories/L2CostRepository'
import { LivenessRepository } from './repositories/LivenessRepository'
import { NotificationsRepository } from './repositories/NotificationsRepository'
import { ProjectValueRepository } from './repositories/ProjectValueRepository'
import { RealTimeAnomaliesRepository } from './repositories/RealTimeAnomaliesRepository'
import { RealTimeLivenessRepository } from './repositories/RealTimeLivenessRepository'
import { StakeRepository } from './repositories/StakeRepository'
import { SyncMetadataRepository } from './repositories/SyncMetadataRepository'
import { TokenMetadataRepository } from './repositories/TokenMetadataRepository'
import { TokenValueRepository } from './repositories/TokenValueRepository'
import { TvsAmountRepository } from './repositories/TvsAmountRepository'
import { TvsBlockTimestampRepository } from './repositories/TvsBlockTimestampRepository'
import { TvsPriceRepository } from './repositories/TvsPriceRepository'
import { UpdateDiffRepository } from './repositories/UpdateDiffRepository'
import { UpdateMessageRepository } from './repositories/UpdateMessageRepository'
import { UpdateMonitorRepository } from './repositories/UpdateMonitorRepository'
import { UpdateNotifierRepository } from './repositories/UpdateNotifierRepository'
import { VerifierStatusRepository } from './repositories/VerifierStatusRepository'
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

    // #region Bridges
    bridgeEvent: new BridgeEventRepository(db),
    bridgeMessage: new BridgeMessageRepository(db),
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
    syncMetadata: new SyncMetadataRepository(db),
    notifications: new NotificationsRepository(db),
    // #endregion

    // #region Tvs
    tvsPrice: new TvsPriceRepository(db),
    tvsAmount: new TvsAmountRepository(db),
    tvsBlockTimestamp: new TvsBlockTimestampRepository(db),
    tvsTokenValue: new TokenValueRepository(db),
    tvsTokenMetadata: new TokenMetadataRepository(db),
    tvsProjectValue: new ProjectValueRepository(db),
    // #endregion

    // #region
    stats: () => getDatabaseStats(db),
    // #endregion
  }
}
