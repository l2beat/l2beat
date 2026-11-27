import type { Project } from '@l2beat/config'
import type { Database, TokenValueRecord } from '@l2beat/database'
import { assert, TokenId } from '@l2beat/shared-pure'
import { getLatestTvsTimestamp } from '../../utils/getLatestTvsTimestamp'
import type { Token } from './types'

type TokensProject = Project<
  never,
  'tvsConfig' | 'tvsTokenAddresses' | 'chainConfig'
>

export async function getTokensData(
  db: Database,
  project: TokensProject,
): Promise<Token[]> {
  const tokenValues = await db.tvsTokenValue.getByProjectAtOrBefore(
    project.id,
    await getLatestTvsTimestamp(db),
  )
  return toTokens(project, tokenValues)
}

/**
 * Same mapping as the website's TVS breakdown table
 * (frontend getProjectTokensEntries), so both show the same numbers. Tokens
 * with no synced value are left out, as on the website, never shown as 0.
 */
export function toTokens(
  project: TokensProject,
  tokenValues: TokenValueRecord[],
): Token[] {
  assert(project.tvsConfig)
  const tokenValuesMap = new Map(
    tokenValues.map((x) => [TokenId(x.tokenId), x]),
  )
  const gasTokens = project.chainConfig?.gasTokens?.map((symbol) =>
    symbol.toUpperCase(),
  )

  const tokens: Token[] = []
  for (const token of project.tvsConfig) {
    const tokenValue = tokenValuesMap.get(token.id)
    if (!tokenValue) continue

    tokens.push({
      tokenId: token.id,
      symbol: token.symbol,
      source: token.source === 'custom-canonical' ? 'canonical' : token.source,
      category: token.category,
      priceUsd: tokenValue.priceUsd,
      valueUsd: tokenValue.valueForProject,
      name: token.name,
      amount: tokenValue.amount,
      addresses: project.tvsTokenAddresses?.[token.id] ?? [],
      isGasToken: gasTokens?.includes(token.symbol.toUpperCase()) ?? false,
      isAssociated: token.isAssociated,
      bridgedUsing: token.bridgedUsing ?? null,
      timestamp: tokenValue.timestamp,
    })
  }

  tokens.sort((a, b) => b.valueUsd - a.valueUsd)
  return tokens
}
