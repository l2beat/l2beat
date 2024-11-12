import { assert } from '@l2beat/shared-pure'
import { type Token, type Report } from '../report-context'
import { uniq } from 'lodash'

export interface TokenEntry {
  token: {
    symbol: string
    name: string
    logoUrl: string
  }
  network: {
    name: string
    logoUrl: string | undefined
  }
  usdValue: number
  amount: number
  type: string
  managedBy: string
  underlyingTokens: {
    tokens: Token[]
    count: number
    chainCount: number
  }
}

export function getTokenEntries(report: Report): TokenEntry[] {
  const tokenEntries = report.tokens.map<TokenEntry>((token) => {
    const meta = token.meta
    assert(meta, 'Token meta not found')
    const chain = report.chains[token.token.networkId]
    assert(chain, 'Chain not found')

    const underlyingTokens = getUnderlyingTokens(report, token.token.id)

    return {
      token: {
        symbol: meta.symbol!,
        name: meta.name!,
        logoUrl: meta.logoUrl!,
      },
      network: {
        name: chain.name,
        logoUrl: chain.logoUrl,
      },
      usdValue: token.usdValue,
      amount: token.amount,
      type: underlyingTokens.length > 0 ? 'IOU' : 'Native',
      managedBy: 'N/A',
      underlyingTokens: {
        tokens: underlyingTokens,
        count: underlyingTokens.length,
        chainCount: uniq(underlyingTokens.map((token) => token.token.networkId))
          .length,
      },
    }
  })

  return tokenEntries
}

function getUnderlyingTokens(report: Report, tokenId: string) {
  const underlyingTokens = []
  const relations = Object.values(report.relations)
  let currentTokenId = tokenId
  const tokenSet = new Set<string>(currentTokenId)

  while (true) {
    const relation = relations.find(
      (relation) => relation.targetTokenId === currentTokenId,
    )
    if (!relation || tokenSet.has(relation.sourceTokenId)) {
      break
    }
    const token = report.tokens.find(
      (token) => token.token.id === relation.sourceTokenId,
    )
    assert(token, 'Token not found')
    underlyingTokens.push(token)
    tokenSet.add(currentTokenId)
    currentTokenId = relation.sourceTokenId
  }
  return underlyingTokens
}
