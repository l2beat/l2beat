import {
  Bridge,
  DuplicateData,
  getCanonicalTokenBySymbol,
  Layer2,
  Layer2Liveness,
  Layer2LivenessConfiguration,
  Layer2TransactionApi,
  Layer3,
  tokenList,
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
  makeLivenessSharpSubmissions,
  makeLivenessTransfer,
} from '../core/liveness/types/LivenessConfig'

interface LivenessConfig {
  entries: LivenessConfigEntry[]
  duplicateData?: DuplicateData[]
}

export interface Project {
  projectId: ProjectId
  isArchived?: boolean
  type: 'layer2' | 'layer3' | 'bridge'
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

export function layer3ToProject(layer3: Layer3): Project {
  return {
    projectId: layer3.id,
    type: 'layer3',
    isUpcoming: layer3.isUpcoming,
    escrows: layer3.config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*'
          ? tokenList.filter((t) => t.type === 'CBV')
          : escrow.tokens.map(getCanonicalTokenBySymbol),
    })),
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
  config: Layer2Liveness | undefined,
): LivenessConfig | undefined {
  if (config === undefined) return

  const livenessConfig: LivenessConfig = {
    entries: [],
    duplicateData: config.duplicateData,
  }

  function addEntry(param: Layer2LivenessConfiguration, type: LivenessType) {
    if (param.formula === 'functionCall') {
      livenessConfig.entries.push(
        makeLivenessFunctionCall({ projectId, type, ...param }),
      )
    } else if (param.formula === 'transfer') {
      livenessConfig.entries.push(
        makeLivenessTransfer({ projectId, type, ...param }),
      )
    } else {
      livenessConfig.entries.push(
        makeLivenessSharpSubmissions({ projectId, type, ...param }),
      )
    }
  }

  config.stateUpdates.forEach((param) => addEntry(param, 'STATE'))
  config.batchSubmissions.forEach((param) => addEntry(param, 'DA'))
  config.proofSubmissions.forEach((param) => addEntry(param, 'PROOF'))

  return livenessConfig
}
