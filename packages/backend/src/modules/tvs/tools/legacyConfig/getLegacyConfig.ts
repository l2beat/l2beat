import type { Project, ProjectEscrow } from '@l2beat/config'
import type { LegacyToken } from '@l2beat/shared-pure'
import type { LegacyEscrow, LegacyProjectConfig } from './types'

export function getLegacyConfig(
  project: Project<'escrows' | 'tvsInfo', 'chainConfig'>,
  tokenList: LegacyToken[],
): LegacyProjectConfig {
  const tokens = project.chainConfig
    ? tokenList.filter(
        (t) =>
          t.supply !== 'zero' && t.chainId === project.chainConfig?.chainId,
      )
    : []

  return {
    escrows: project.escrows.map((e) => toLegacyEscrow(e, tokenList)),
    tokens,
    associatedTokens: project.tvsInfo.associatedTokens ?? [],
  }
}

function toLegacyEscrow(
  escrow: ProjectEscrow,
  tokenList: LegacyToken[],
): LegacyEscrow {
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
          (!token.untilTimestamp ||
            token.untilTimestamp > escrow.sinceTimestamp),
      )
      .map((token) => ({
        ...token,
        isPreminted: !!escrow.premintedTokens?.includes(token.symbol),
      })),
  }
}
