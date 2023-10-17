import {
  Bridge,
  getCanonicalTokenBySymbol,
  Layer2,
  Layer2LivenessConfig,
  Layer2TransactionApi,
  tokenList,
} from '@l2beat/config'
import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { LivenessConfig } from '../core/liveness/types/LivenessConfig'

export interface Project {
  projectId: ProjectId
  type: 'layer2' | 'bridge'
  escrows: ProjectEscrow[]
  transactionApi?: Layer2TransactionApi
  livenessConfig?: LivenessConfig
}

export interface ProjectEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  tokens: Token[]
}

export function layer2ToProject(layer2: Layer2): Project {
  return {
    projectId: layer2.id,
    type: 'layer2',
    escrows: layer2.config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*'
          ? tokenList.filter((t) => t.type === 'CBV')
          : escrow.tokens.map(getCanonicalTokenBySymbol),
    })),
    transactionApi: layer2.config.transactionApi,
    livenessConfig: toBackendLivenessConfig(layer2.id, layer2.config.liveness),
  }
}

export function bridgeToProject(bridge: Bridge): Project {
  return {
    projectId: bridge.id,
    type: 'bridge',
    escrows: bridge.config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*'
          ? tokenList.filter((t) => t.type === 'CBV')
          : escrow.tokens.map(getCanonicalTokenBySymbol),
    })),
  }
}

function toBackendLivenessConfig(
  projectId: ProjectId,
  config: Layer2LivenessConfig,
): LivenessConfig {}
// projectId: ProjectId
// type: LivenessType
// from: EthereumAddress
// to: EthereumAddress
// untilTimestamp?: UnixTime
