import { PoolConfig } from 'pg'
import { AggregatedL2CostRepository } from './aggregated-l2-cost/repository'
import { AmountRepository } from './amount/repository'
import { BlockTimestampRepository } from './block-timestamp/repository'
import { BridgeEscrowRepository } from './bridge-escrow/repository'
import { CacheRepository } from './cache/repository'
import { CurrentPriceRepository } from './current-price'
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
import { TrackedTxsConfigsRepository } from './tracked-tx-config/repository'
import { TvlCleanerRepository } from './tvl-cleaner/repository'
import { UpdateMonitorRepository } from './update-monitor/repository'
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
    amount: new AmountRepository(db),
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
    trackedTxConfig: new TrackedTxsConfigsRepository(db),
    tvlCleaner: new TvlCleanerRepository(db),
    updateMonitor: new UpdateMonitorRepository(db),
    value: new ValueRepository(db),
    verifierStatus: new VerifierStatusRepository(db),
  }

  // L2BEAT - activity
}

export type Database = ReturnType<typeof createRepositories>

export type { CurrentPrice } from './current-price'
export type { Stake } from './stake'
