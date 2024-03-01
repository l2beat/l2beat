import {
  Bridge,
  DuplicateData,
  getCanonicalTokenBySymbol,
  Layer2,
  Layer2FinalityConfig,
  Layer2TrackedTransactionConfig,
  Layer2TransactionApi,
  tokenList,
} from '@l2beat/config'
import {
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { LivenessConfigEntry } from '../modules/liveness/types/LivenessConfig'
import {
  makeSharpSubmissionsQuery,
  TrackedTransactionsConfig,
} from '../modules/liveness/types/TrackedTransactionsConfig'

interface LivenessConfig {
  entries: LivenessConfigEntry[]
  duplicateData?: DuplicateData[]
}

export interface Project {
  projectId: ProjectId
  slug: string
  isArchived?: boolean
  type: 'layer2' | 'bridge'
  isUpcoming?: boolean
  isLayer3?: boolean
  escrows: ProjectEscrow[]
  transactionApi?: Layer2TransactionApi
  trackedTransactionsConfig?: TrackedTransactionsConfig
  finalityConfig?: Layer2FinalityConfig
}

export interface ProjectEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  tokens: Token[]
}

export function layer2ToProject(layer2: Layer2): Project {
  return {
    projectId: layer2.id,
    slug: layer2.display.slug,
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
    trackedTransactionsConfig: toBackendTrackedTransactionsConfig(
      layer2.id,
      layer2.config.trackedTransactions,
    ),
    finalityConfig: layer2.config.finality,
  }
}

export function bridgeToProject(bridge: Bridge): Project {
  return {
    projectId: bridge.id,
    slug: bridge.display.slug,
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

function toBackendTrackedTransactionsConfig(
  projectId: ProjectId,
  configs: Layer2TrackedTransactionConfig[] | undefined,
): TrackedTransactionsConfig | undefined {
  if (configs === undefined) return

  const trackedTransactionsConfig: TrackedTransactionsConfig = {
    entries: configs.map((config) => {
      if (config.query.formula === 'sharpSubmission') {
        return {
          projectId,
          ...config,
          query: makeSharpSubmissionsQuery(config.query),
        }
      }

      return {
        projectId,
        ...config,
      }
    }),
  }

  return trackedTransactionsConfig
}
