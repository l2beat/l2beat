import { type StringWithAutocomplete, notUndefined } from '@l2beat/shared-pure'
import { getRequiredTokenMeta } from '~/app/insight/_utils/get-required-token-meta'
import { type Report, type Token } from '../report-context'

export interface TokenEntry {
  symbol: string
  name: string
  logoUrl: string
  address: string
  chain: {
    id: string
    name: string
    logoUrl: string | undefined
  }
  usdValue: number
  amount: number
  type: StringWithAutocomplete<'Native' | 'IOU'>
  managedBy: string
  underlyingTokens: UnderlyingTokenEntry[]
}

export type UnderlyingTokenEntry = Omit<TokenEntry, 'underlyingTokens'>

export function getTokenEntries(report: Report): TokenEntry[] {
  const tokenEntries = report.tokens
    .map((token) => {
      const underlyingTokens = getUnderlyingTokens(report, token.token.id)
      return getTokenEntry(token, report, underlyingTokens)
    })
    .filter(notUndefined)

  return tokenEntries
}

function getTokenEntry(
  token: Token,
  report: Report,
  underlyingTokens?: UnderlyingTokenEntry[],
): TokenEntry | undefined {
  if (token.usdValue === 0) {
    return undefined
  }
  const meta = getRequiredTokenMeta(token.meta)
  const chain = report.chains[token.token.networkId]
  if (!meta || !chain) {
    return undefined
  }

  return {
    symbol: meta.symbol,
    name: meta.name,
    address: token.token.address,
    logoUrl: meta.logoUrl,
    chain: {
      id: chain.id,
      name: chain.name,
      logoUrl: chain.logoUrl,
    },
    usdValue: token.usdValue,
    amount: token.amount,
    type: underlyingTokens?.length !== 0 ? 'IOU' : 'Native',
    managedBy: 'N/A',
    underlyingTokens: underlyingTokens ?? [],
  }
}

function getUnderlyingTokens(report: Report, tokenId: string) {
  const underlyingTokens: UnderlyingTokenEntry[] = []
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
    if (!token) {
      break
    }
    const tokenEntry = getTokenEntry(token, report)
    if (!tokenEntry) {
      break
    }
    underlyingTokens.push(tokenEntry)
    tokenSet.add(currentTokenId)
    currentTokenId = relation.sourceTokenId
  }
  return underlyingTokens
}
