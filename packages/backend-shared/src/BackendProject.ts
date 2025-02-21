import {
  type Bridge,
  type ChainConfig,
  type Layer2,
  type Layer2FinalityConfig,
  type ProjectLivenessConfig,
  type Layer3,
  type ProjectEscrow,
  type SharedEscrow,
  type TransactionApiConfig,
  tokenList,
} from '@l2beat/config'
import {
  assert,
  type EthereumAddress,
  type ProjectId,
  type Token,
  type TokenBridgedUsing,
  type UnixTime,
} from '@l2beat/shared-pure'

export interface BackendProject {
  projectId: ProjectId
  chain?: ChainConfig
  slug: string
  isArchived?: boolean
  type: 'layer2' | 'bridge' | 'layer3'
  isUpcoming?: boolean
  escrows: BackendProjectEscrow[]
  transactionApi?: TransactionApiConfig
  livenessConfig?: ProjectLivenessConfig
  finalityConfig?: Layer2FinalityConfig
  associatedTokens?: string[]
}

export interface BackendProjectEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  tokens: (Token & { isPreminted: boolean })[]
  chain: string
  includeInTotal?: boolean
  source?: ProjectEscrow['source']
  bridgedUsing?: TokenBridgedUsing
  sharedEscrow?: SharedEscrow
}

export function toBackendProject(
  project: Layer2 | Layer3 | Bridge,
): BackendProject {
  if (project.type === 'layer2') {
    return layer2ToBackendProject(project)
  }

  if (project.type === 'layer3') {
    return layer3ToBackendProject(project)
  }

  if (project.type === 'bridge') {
    return bridgeToBackendProject(project)
  }

  throw new Error(`Unknown project type: ${project}`)
}

function layer2ToBackendProject(layer2: Layer2): BackendProject {
  return {
    projectId: layer2.id,
    slug: layer2.display.slug,
    type: 'layer2',
    chain: layer2.chainConfig,
    isUpcoming: layer2.isUpcoming,
    isArchived: layer2.isArchived,
    escrows: layer2.config.escrows.map(toProjectEscrow),
    transactionApi: layer2.config.transactionApi,
    livenessConfig: layer2.config.liveness,
    finalityConfig: layer2.config.finality,
    associatedTokens: layer2.config.associatedTokens,
  }
}

function bridgeToBackendProject(bridge: Bridge): BackendProject {
  return {
    projectId: bridge.id,
    slug: bridge.display.slug,
    type: 'bridge',
    chain: bridge.chainConfig,
    escrows: bridge.config.escrows.map(toProjectEscrow),
    associatedTokens: bridge.config.associatedTokens,
  }
}

function layer3ToBackendProject(layer3: Layer3): BackendProject {
  return {
    projectId: layer3.id,
    slug: layer3.display.slug,
    type: 'layer3',
    chain: layer3.chainConfig,
    isUpcoming: layer3.isUpcoming,
    escrows: layer3.config.escrows.map(toProjectEscrow),
    associatedTokens: layer3.config.associatedTokens,
  }
}

function toProjectEscrow(escrow: ProjectEscrow): BackendProjectEscrow {
  const chainId = escrow.chainId
  assert(chainId, 'Missing escrow chainId')

  const tokensOnChain = tokenList.filter((t) => t.chainId === chainId)

  return {
    address: escrow.address,
    sinceTimestamp: escrow.sinceTimestamp,
    tokens: mapTokens(escrow, tokensOnChain),
    chain: escrow.chain,
    includeInTotal: escrow.includeInTotal,
    source: escrow.source,
    bridgedUsing: escrow.bridgedUsing,
    sharedEscrow: escrow.sharedEscrow,
  }
}

export function mapTokens(
  escrow: ProjectEscrow,
  tokensOnChain: Token[],
): (Token & { isPreminted: boolean })[] {
  return tokensOnChain
    .filter(
      (token) =>
        isTokenIncluded(token, escrow) && !isTokenPhasedOut(token, escrow),
    )
    .map((token) => ({ ...token, isPreminted: isPreminted(token, escrow) }))
}

function isTokenPhasedOut(token: Token, escrow: ProjectEscrow): unknown {
  if (token.untilTimestamp === undefined) return false

  return token.untilTimestamp.lt(escrow.sinceTimestamp)
}

function isTokenIncluded(token: Token, escrow: ProjectEscrow): boolean {
  return (
    (escrow.tokens === '*' || escrow.tokens.includes(token.symbol)) &&
    !escrow.excludedTokens?.includes(token.symbol)
  )
}

function isPreminted(token: Token, escrow: ProjectEscrow): boolean {
  if (escrow.premintedTokens === undefined) {
    return false
  }

  return escrow.premintedTokens.includes(token.symbol)
}
