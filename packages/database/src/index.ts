import { PoolConfig } from 'pg'
import { PostgresDatabase } from './kysely'
import { BridgeEscrowRepository } from './token-db/bridge-escrow/repository'
import { CacheRepository } from './token-db/cache/repository'
import { DeploymentRepository } from './token-db/deployment/repository'
import { ExternalBridgeRepository } from './token-db/external-bridge/repository'
import { NetworkExplorerRepository } from './token-db/network-explorer/repository'
import { NetworkRpcRepository } from './token-db/network-rpc/repository'
import { NetworkRepository } from './token-db/network/repository'
import { TokenBridgeRepository } from './token-db/token-bridge/repository'
import { TokenMetaRepository } from './token-db/token-meta/repository'
import { TokenRepository } from './token-db/token/repository'

export function createRepositories(config?: PoolConfig) {
  const db = new PostgresDatabase(config)

  return {
    tokenDb: {
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
    },
  }
}
