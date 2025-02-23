import {
  type Bridge,
  type ChainConfig,
  type Layer2,
  type Layer3,
  type ProjectEscrow,
  type SharedEscrow,
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
  escrows: BackendProjectEscrow[]
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
  return {
    projectId: project.id,
    chain: project.chainConfig,
    escrows: project.config.escrows.map(toProjectEscrow),
    associatedTokens: project.config.associatedTokens,
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
