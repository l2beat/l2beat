import { PoolConfig } from 'pg'
import { BridgeEscrowRepository } from './bridge-escrow/repository'
import { CacheRepository } from './cache/repository'
import { DeploymentRepository } from './deployment/repository'
import { ExternalBridgeRepository } from './external-bridge/repository'
import { PostgresDatabase } from './kysely'
import { NetworkExplorerRepository } from './network-explorer/repository'
import { NetworkRpcRepository } from './network-rpc/repository'
import { NetworkRepository } from './network/repository'
import { TokenBridgeRepository } from './token-bridge/repository'
import { TokenMetaRepository } from './token-meta/repository'
import { TokenRepository } from './token/repository'

export function createRepositories(config?: PoolConfig) {
  const db = new PostgresDatabase({ ...config, log: console.dir })

  return {
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
  }
}
