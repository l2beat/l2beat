import {
  Bridge,
  DuplicateData,
  FunctionCallParams,
  getCanonicalTokenBySymbol,
  Layer2,
  Layer2LivenessConfig,
  Layer2TransactionApi,
  tokenList,
  TransferParams,
} from '@l2beat/config'
import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  LivenessConfigEntry,
  makeLivenessFunctionCall,
  makeLivenessTransfer,
} from '../core/liveness/types/LivenessConfig'

interface LivenessConfig {
  entries: LivenessConfigEntry[]
  duplicateData?: DuplicateData[]
}

export interface Project {
  projectId: ProjectId
  isArchived?: boolean
  type: 'layer2' | 'bridge'
  isUpcoming?: boolean
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
    isUpcoming: layer2.isUpcoming,
    isArchived: layer2.isArchived,
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
  config: Layer2LivenessConfig | undefined,
): LivenessConfig | undefined {
  if (config === undefined) return

  const livenessConfig: LivenessConfig = {
    entries: [],
    duplicateData: config.duplicateData,
  }

  function addEntry(
    param: FunctionCallParams | TransferParams,
    type: LivenessType,
  ) {
    if (param.formula === 'functionCall') {
      livenessConfig.entries.push(
        makeLivenessFunctionCall({ projectId, type, ...param }),
      )
    } else {
      livenessConfig.entries.push(
        makeLivenessTransfer({ projectId, type, ...param }),
      )
    }
  }

  config.stateUpdates.forEach((param) => addEntry(param, 'STATE'))
  config.batchSubmissions.forEach((param) => addEntry(param, 'DA'))
  config.proofSubmissions.forEach((param) => addEntry(param, 'PROOF'))

  // TODO: assert unique ids for entries. Probably in tests for backend

  return livenessConfig
}
