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
  LivenessFunctionCall,
  LivenessTransfer,
} from '../core/liveness/types/LivenessConfig'

interface LivenessConfig {
  transfers: Omit<
    LivenessTransfer,
    'livenessConfigurationId' | 'latestSyncedTimestamp'
  >[]
  functionCalls: Omit<
    LivenessFunctionCall,
    'livenessConfigurationId' | 'latestSyncedTimestamp'
  >[]
  duplicateData?: DuplicateData[]
}
export interface Project {
  projectId: ProjectId
  isArchived?: boolean
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
    transfers: [],
    functionCalls: [],
    duplicateData: config.duplicateData,
  }

  config.stateUpdates.forEach((param) => {
    if (param.formula === 'functionCall') {
      livenessConfig.functionCalls.push(
        getFunctionCallRecord(param, projectId, 'STATE'),
      )
    } else {
      livenessConfig.transfers.push(
        getTransferRecord(param, projectId, 'STATE'),
      )
    }
  })

  config.batchSubmissions.forEach((param) => {
    if (param.formula === 'functionCall') {
      livenessConfig.functionCalls.push(
        getFunctionCallRecord(param, projectId, 'DA'),
      )
    } else {
      livenessConfig.transfers.push(getTransferRecord(param, projectId, 'DA'))
    }
  })

  config.proofSubmissions.forEach((param) => {
    if (param.formula === 'functionCall') {
      livenessConfig.functionCalls.push(
        getFunctionCallRecord(param, projectId, 'PROOF'),
      )
    } else {
      livenessConfig.transfers.push(
        getTransferRecord(param, projectId, 'PROOF'),
      )
    }
  })

  return livenessConfig
}

function getFunctionCallRecord(
  param: FunctionCallParams,
  projectId: ProjectId,
  type: LivenessType,
) {
  return {
    address: param.address,
    projectId,
    selector: param.selector,
    type: LivenessType(type),
    sinceTimestamp: param.sinceTimestamp,
    untilTimestamp: param.untilTimestamp,
  }
}

function getTransferRecord(
  param: TransferParams,
  projectId: ProjectId,
  type: LivenessType,
) {
  return {
    from: param.from,
    projectId,
    to: param.to,
    type: LivenessType(type),
    sinceTimestamp: param.sinceTimestamp,
    untilTimestamp: param.untilTimestamp,
  }
}
