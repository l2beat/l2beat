import type { Project } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { assert, TokenId, UnixTime } from '@l2beat/shared-pure'
import type { Token } from './types'

export async function getTokensData(
  db: Database,
  project: Project<never, 'tvsConfig'>,
): Promise<Token[]> {
  assert(project.tvsConfig)
  const targetTimestamp = UnixTime.toStartOf(
    UnixTime.now() - UnixTime.HOUR - 15 * UnixTime.MINUTE,
    'hour',
  )

  const tokenValues = await db.tvsTokenValue.getByProjectAtOrBefore(
    project.id,
    targetTimestamp,
  )

  const tokenValuesMap = new Map(
    tokenValues.map((x) => [TokenId(x.tokenId), x]),
  )

  const tokens: Token[] = []
  for (const token of project.tvsConfig) {
    const tokenValue = tokenValuesMap.get(token.id)
    if (!tokenValue) continue

    tokens.push({
      tokenId: token.id,
      symbol: token.symbol,
      source: token.source,
      category: token.category,
      priceUsd: tokenValue.priceUsd,
      valueUsd: tokenValue.valueForProject,
    })
  }

  tokens.sort((a, b) => b.valueUsd - a.valueUsd)
  return tokens
}
