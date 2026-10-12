import type { ProjectDefiToken } from '@l2beat/config'
import type { AbstractTokenRecord } from '@l2beat/database'
import { env } from '~/env'
import { getInteropTokenPagePath } from '~/pages/interop/utils/getInteropTokenUrl'
import { getTokenDb } from '~/server/tokenDb'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'

export interface DefiProjectToken extends ProjectDefiToken {
  icon: string
  /** The token's page, when the token database knows the symbol. */
  href?: string
}

type KnownToken = Pick<
  AbstractTokenRecord,
  'id' | 'symbol' | 'issuer' | 'iconUrl' | 'reviewed'
>

const knownTokensCache = new FrontendInMemoryCache('getDefiProjectTokens')

/**
 * The protocol's configured tokens, linked to their token pages by symbol.
 * A symbol several issuers share resolves to the one issued by the project,
 * else to a reviewed one, else to none: a wrong link is worse than no link.
 */
export async function getDefiProjectTokens(
  projectSlug: string,
  tokens: ProjectDefiToken[],
): Promise<DefiProjectToken[]> {
  if (tokens.length === 0) {
    return []
  }
  const known = await getKnownTokensBySymbol()
  return tokens.map((token) => {
    const match = pickToken(
      known.get(token.symbol.toLowerCase()) ?? [],
      projectSlug,
    )
    return {
      ...token,
      icon: match?.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      href: match ? getInteropTokenPagePath(match) : undefined,
    }
  })
}

function pickToken(candidates: KnownToken[], projectSlug: string) {
  if (candidates.length <= 1) {
    return candidates[0]
  }
  return (
    candidates.find((candidate) => candidate.issuer === projectSlug) ??
    candidates.find((candidate) => candidate.reviewed)
  )
}

async function getKnownTokensBySymbol(): Promise<Map<string, KnownToken[]>> {
  const records: KnownToken[] = env.MOCK
    ? MOCK_KNOWN_TOKENS
    : await knownTokensCache.get(
        {
          key: ['defi-known-tokens'],
          ttl: 60 * 10,
          staleWhileRevalidate: 60 * 15,
        },
        () => getTokenDb().abstractToken.getAll(),
      )
  const bySymbol = new Map<string, KnownToken[]>()
  for (const record of records) {
    const key = record.symbol.toLowerCase()
    bySymbol.set(key, [...(bySymbol.get(key) ?? []), record])
  }
  return bySymbol
}

// The two liquid staking tokens with a token page on l2beat.com, as of 2026-10.
const MOCK_KNOWN_TOKENS: KnownToken[] = [
  {
    id: 'ObxzPG',
    symbol: 'wstETH',
    issuer: 'lido',
    iconUrl: null,
    reviewed: true,
  },
  {
    id: 'aP73dU',
    symbol: 'weETH',
    issuer: 'etherfi',
    iconUrl: null,
    reviewed: true,
  },
]
