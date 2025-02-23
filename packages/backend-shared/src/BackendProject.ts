import {
  type Bridge,
  type ChainConfig,
  type Layer2,
  type Layer3,
  type ProjectEscrow,
  type SharedEscrow,
  tokenList,
} from '@l2beat/config'
import type {
  EthereumAddress,
  ProjectId,
  Token,
  TokenBridgedUsing,
  UnixTime,
} from '@l2beat/shared-pure'

export interface BackendProject {
  id: ProjectId
  chainConfig?: ChainConfig
  tvlConfig: {
    escrows: BackendProjectEscrow[]
    associatedTokens?: string[]
  }
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
    id: project.id,
    chainConfig: project.chainConfig,
    tvlConfig: {
      escrows: project.config.escrows.map(toProjectEscrow),
      associatedTokens: project.config.associatedTokens,
    },
  }
}

function toProjectEscrow(escrow: ProjectEscrow): BackendProjectEscrow {
  return {
    address: escrow.address,
    sinceTimestamp: escrow.sinceTimestamp,
    chain: escrow.chain,
    includeInTotal: escrow.includeInTotal,
    source: escrow.source,
    bridgedUsing: escrow.bridgedUsing,
    sharedEscrow: escrow.sharedEscrow,
    tokens: tokenList
      .filter(
        (token) =>
          token.chainId === escrow.chainId &&
          (escrow.tokens === '*' || escrow.tokens.includes(token.symbol)) &&
          !escrow.excludedTokens?.includes(token.symbol) &&
          !token.untilTimestamp?.lt(escrow.sinceTimestamp),
      )
      .map((token) => ({
        ...token,
        isPreminted: !!escrow.premintedTokens?.includes(token.symbol),
      })),
  }
}
