import {
  Bridge,
  getTokenBySymbol,
  Layer2,
  Layer2ExternalAssets,
  Layer2TransactionApi,
  TokenInfo,
  tokenList,
} from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface Project {
  projectId: ProjectId
  type: 'layer2' | 'bridge'
  externalTokens?: Layer2ExternalAssets
  escrows: ProjectEscrow[]
  transactionApi?: Layer2TransactionApi
}

export interface ProjectEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  tokens: TokenInfo[]
}

export function layer2ToProject(layer2: Layer2): Project {
  return {
    projectId: layer2.id,
    type: 'layer2',
    externalTokens: layer2.config.externalAssets ?? undefined,
    escrows: layer2.config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*' ? tokenList : escrow.tokens.map(getTokenBySymbol),
    })),
    transactionApi: layer2.config.transactionApi,
  }
}

export function bridgeToProject(bridge: Bridge): Project {
  return {
    projectId: bridge.id,
    type: 'bridge',
    externalTokens: undefined,
    escrows: bridge.config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*' ? tokenList : escrow.tokens.map(getTokenBySymbol),
    })),
  }
}
