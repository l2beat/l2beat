import { PoolConfig } from 'pg'
import { BlockTransactionCountRepository } from './activity-block/repository'
import { StarkExTransactionCountRepository } from './activity-starkex/repository'
import { ZkSyncTransactionRepository } from './activity-zksync/repository'
import { AggregatedL2CostRepository } from './aggregated-l2-cost/repository'
import { AggregatedLivenessRepository } from './aggregated-liveness/repository'
import { AmountRepository } from './amount/repository'
import { AnomaliesRepository } from './anomalies/repository'
import { BlockTimestampRepository } from './block-timestamp/repository'
import { BridgeEscrowRepository } from './bridge-escrow/repository'
import { CacheRepository } from './cache/repository'
import { CurrentPriceRepository } from './current-price/repository'
import { DailyDiscoveryRepository } from './daily-discovery/repository'
import { DeploymentRepository } from './deployment/repository'
import { DiscoveryCacheRepository } from './discovery-cache/repository'
import { ExternalBridgeRepository } from './external-bridge/repository'
import { FinalityRepository } from './finality/repository'
import { IndexerConfigurationRepository } from './indexer-configuration/repository'
import { IndexerStateRepository } from './indexer-state/repository'
import { PostgresDatabase } from './kysely'
import { L2CostPriceRepository } from './l2-cost-price/repository'
import { L2CostRepository } from './l2-cost/repository'
import { LivenessRepository } from './liveness/repository'
import { NetworkExplorerRepository } from './network-explorer/repository'
import { NetworkRpcRepository } from './network-rpc/repository'
import { NetworkRepository } from './network/repository'
import { PriceRepository } from './price/repository'
import { SequenceProcessorRepository } from './sequence-processor/repository'
import { StakeRepository } from './stake/repository'
import { TokenBridgeRepository } from './token-bridge/repository'
import { TokenMetaRepository } from './token-meta/repository'
import { TokenRepository } from './token/repository'
import { TvlCleanerRepository } from './tvl-cleaner/repository'
import { UpdateMonitorRepository } from './update-monitor/repository'
import { UpdateNotifierRepository } from './update-notifier/repository'
import { ValueRepository } from './value/repository'
import { VerifierStatusRepository } from './verifier-status/repository'

export function createRepositories(config?: PoolConfig) {
  const db = new PostgresDatabase({ ...config })

  return {
    // DA-BEAT
    currentPrice: new CurrentPriceRepository(db),
    stake: new StakeRepository(db),

    // Token-DB
    bridgeEscrow: new BridgeEscrowRepository(db),
    externalBridge: new ExternalBridgeRepository(db),
    deployment: new DeploymentRepository(db),
    networkRpc: new NetworkRpcRepository(db),
    networkExplorer: new NetworkExplorerRepository(db),
    networks: new NetworkRepository(db),
    tokenBridge: new TokenBridgeRepository(db),
    tokenMeta: new TokenMetaRepository(db),
    token: new TokenRepository(db),
    cache: new CacheRepository(db),

    // L2BEAT - public
    aggregatedL2Cost: new AggregatedL2CostRepository(db),
    aggregatedLiveness: new AggregatedLivenessRepository(db),
    amount: new AmountRepository(db),
    anomalies: new AnomaliesRepository(db),
    blockTimestamp: new BlockTimestampRepository(db),
    dailyDiscovery: new DailyDiscoveryRepository(db),
    discoveryCache: new DiscoveryCacheRepository(db),
    finality: new FinalityRepository(db),
    indexerConfiguration: new IndexerConfigurationRepository(db),
    indexerState: new IndexerStateRepository(db),
    l2Cost: new L2CostRepository(db),
    l2CostPrice: new L2CostPriceRepository(db),
    liveness: new LivenessRepository(db),
    price: new PriceRepository(db),
    sequenceProcessor: new SequenceProcessorRepository(db),
    tvlCleaner: new TvlCleanerRepository(db),
    updateMonitor: new UpdateMonitorRepository(db),
    updateNotifierRepository: new UpdateNotifierRepository(db),
    value: new ValueRepository(db),
    verifierStatus: new VerifierStatusRepository(db),

    // L2BEAT - activity
    blockTransactionCount: new BlockTransactionCountRepository(db),
    starkExTransactionCount: new StarkExTransactionCountRepository(db),
    zkSyncTransactionCount: new ZkSyncTransactionRepository(db),
  }
}

export type Database = ReturnType<typeof createRepositories>

export type { BlockTransactionCountRecord } from './activity-block/entity'
export type { StarkExTransactionCountRecord } from './activity-starkex/entity'
export type { ZkSyncTransactionRecord } from './activity-zksync/entity'
export type { AggregatedL2CostRecord } from './aggregated-l2-cost/entity'
export type {
  AggregatedLivenessRecord,
  AggregatedLivenessRange,
} from './aggregated-liveness/entity'
export type { AmountRecord } from './amount/entity'
export type { AnomalyRecord } from './anomalies/entity'
export type { BlockTimestampRecord } from './block-timestamp/entity'
export type { BridgeEscrowRecord } from './bridge-escrow/entity'
export type { CacheRecord } from './cache/entity'
export type { CurrentPriceRecord } from './current-price/entity'
export type { DailyDiscoveryRecord } from './daily-discovery/entity'
export type { DeploymentRecord } from './deployment/entity'
export type { DiscoveryCacheRecord } from './discovery-cache/entity'
export type { ExternalBridgeRecord } from './external-bridge/entity'
export type { FinalityRecord, ProjectFinalityRecord } from './finality/entity'
export type { IndexerConfigurationRecord } from './indexer-configuration/entity'
export type { IndexerStateRecord } from './indexer-state/entity'
export type { L2CostRecord } from './l2-cost/entity'
export type { L2CostPriceRecord } from './l2-cost-price/entity'
export type { LivenessRecord } from './liveness/entity'
export type { NetworkExplorerRecord } from './network-explorer/entity'
export type { NetworkRpcRecord } from './network-rpc/entity'
export type { NetworkRecord } from './network/entity'
export type { PriceRecord } from './price/entity'
export type { SequenceProcessorRecord } from './sequence-processor/entity'
export type { StakeRecord } from './stake/entity'
export type { TokenBridgeRecord } from './token-bridge/entity'
export type { TokenMetaRecord } from './token-meta/entity'
export type { TokenRecord } from './token/entity'
export type { TvlCleanerRecord } from './tvl-cleaner/entity'
export type { UpdateMonitorRecord } from './update-monitor/entity'
export type { UpdateNotifierRecord } from './update-notifier/entity'
export type { ValueRecord } from './value/entity'
export type { VerifierStatusRecord } from './verifier-status/entity'
