import {
  Bridge,
  getCanonicalTokenBySymbol,
  Layer2,
  Layer2FinalityConfig,
  Layer2TransactionApi,
  Layer2TxConfig,
  tokenList,
} from '@l2beat/config'
import {
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { TrackedTxId } from '../modules/tracked-txs/types/TrackedTxId'
import {
  SHARP_SUBMISSION_ADDRESS,
  SHARP_SUBMISSION_SELECTOR,
  TrackedTxsConfig,
  TrackedTxUseWithId,
} from '../modules/tracked-txs/types/TrackedTxsConfig'

export interface Project {
  projectId: ProjectId
  slug: string
  isArchived?: boolean
  type: 'layer2' | 'bridge'
  isUpcoming?: boolean
  isLayer3?: boolean
  escrows: ProjectEscrow[]
  transactionApi?: Layer2TransactionApi
  trackedTxsConfig?: TrackedTxsConfig
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
    trackedTxsConfig: toBackendTrackedTxsConfig(
      layer2.id,
      layer2.config.trackedTxs,
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

function toBackendTrackedTxsConfig(
  projectId: ProjectId,
  configs: Layer2TxConfig[] | undefined,
): TrackedTxsConfig | undefined {
  if (configs === undefined) return

  return {
    entries: configs.map((config) => {
      const query = config.query
      if (query.formula === 'sharpSubmission') {
        return {
          projectId,
          address: SHARP_SUBMISSION_ADDRESS,
          selector: SHARP_SUBMISSION_SELECTOR,
          uses: getTrackedTxsConfigUses(config),
          ...query,
        }
      }

      return {
        projectId,
        ...query,
        uses: getTrackedTxsConfigUses(config),
      }
    }),
  }
}

function getTrackedTxsConfigUses(config: Layer2TxConfig): TrackedTxUseWithId[] {
  return config.uses.map((use) => ({
    ...use,
    id: TrackedTxId([
      JSON.stringify({ type: use.type, subtype: use.subType }),
      JSON.stringify(config.query),
    ]),
  }))
}
