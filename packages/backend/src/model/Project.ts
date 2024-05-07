import { assert } from '@l2beat/backend-tools'
import {
  Bridge,
  chains,
  getCanonicalTokenBySymbol,
  Layer2,
  Layer2FinalityConfig,
  Layer2LivenessConfig,
  Layer2TxConfig,
  Layer3,
  ScalingProjectTransactionApi,
  tokenList,
} from '@l2beat/config'
import {
  ChainId,
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
import { ChainConverter } from '../tools/ChainConverter'

export interface Project {
  projectId: ProjectId
  slug: string
  isArchived?: boolean
  type: 'layer2' | 'bridge' | 'layer3'
  isUpcoming?: boolean
  isLayer3?: boolean
  escrows: ProjectEscrow[]
  transactionApi?: ScalingProjectTransactionApi
  trackedTxsConfig?: TrackedTxsConfig
  livenessConfig?: Layer2LivenessConfig
  finalityConfig?: Layer2FinalityConfig
}

export interface ProjectEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  tokens: Token[]
  chain?: string
  includeInTotal?: boolean
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
          ? tokenList.filter(
              (t) => t.type === 'CBV' && t.chainId === ChainId.ETHEREUM,
            )
          : escrow.tokens.map(getCanonicalTokenBySymbol),
    })),
    transactionApi: layer2.config.transactionApi,
    trackedTxsConfig: toBackendTrackedTxsConfig(
      layer2.id,
      layer2.config.trackedTxs,
    ),
    livenessConfig: layer2.config.liveness,
    finalityConfig:
      layer2.config.finality !== 'coming soon'
        ? layer2.config.finality
        : undefined,
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
          ? tokenList.filter(
              (t) => t.type === 'CBV' && t.chainId === ChainId.ETHEREUM,
            )
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
          costMultiplier: config._hackCostMultiplier,
          ...query,
        }
      }

      return {
        projectId,
        ...query,
        uses: getTrackedTxsConfigUses(config),
        costMultiplier: config._hackCostMultiplier,
      }
    }),
  }
}

const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)

export function layer3ToProject(layer3: Layer3): Project {
  return {
    projectId: layer3.id,
    slug: layer3.display.slug,
    type: 'layer3',
    isUpcoming: layer3.isUpcoming,
    escrows: layer3.config.escrows.map((escrow) => {
      const chain = escrow.chain
      assert(chain, ` ${layer3.id}: chain is required for L3 escrow`)
      const chainId = chainConverter.toChainId(chain)

      const tokensOnChain = tokenList.filter((t) => t.chainId === chainId)

      return {
        address: escrow.address,
        sinceTimestamp: escrow.sinceTimestamp,
        tokens:
          escrow.tokens === '*'
            ? tokensOnChain
            : mapL3Tokens(escrow.tokens, tokensOnChain, layer3, chain),
        chain,
      }
    }),
  }
}

function mapL3Tokens(
  tokens: string[],
  tokensOnChain: Token[],
  layer3: Layer3,
  chain: string,
): Token[] {
  return tokens.map((tokenSymbol) => {
    const token = tokensOnChain.find((t) => t.symbol === tokenSymbol)
    assert(
      token,
      `${layer3.id}: token with symbol ${tokenSymbol} not found on ${chain}`,
    )
    return token
  })
}

function getTrackedTxsConfigUses(config: Layer2TxConfig): TrackedTxUseWithId[] {
  const { untilTimestampExclusive: _, ...queryWithoutUntilTimestamp } =
    config.query

  return config.uses.map((use) => ({
    ...use,
    id: TrackedTxId([
      JSON.stringify(use),
      JSON.stringify(queryWithoutUntilTimestamp),
    ]),
  }))
}
