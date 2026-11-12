import type { ProjectDefiToken } from '@l2beat/config'
import type { AbstractTokenRecord } from '@l2beat/database'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import { getTokenDb } from '~/server/tokenDb'

export interface DefiToken {
  symbol: string
  name: string
  description: string
  /** The token page, when the token database has the token. */
  href?: string
  iconUrl?: string
}

export async function getDefiTokens(
  tokens: ProjectDefiToken[],
): Promise<DefiToken[]> {
  const abstractTokens = await getAbstractTokens(tokens)

  return tokens.map((token) => {
    const abstractToken = abstractTokens.get(
      tokenKey(
        ChainSpecificAddress.longChain(token.address),
        ChainSpecificAddress.address(token.address),
      ),
    )
    return {
      symbol: token.symbol,
      name: token.name,
      description: token.description,
      href: abstractToken && getInteropTokenUrl(abstractToken),
      iconUrl: abstractToken?.iconUrl ?? undefined,
    }
  })
}

async function getAbstractTokens(
  tokens: ProjectDefiToken[],
): Promise<Map<string, AbstractTokenRecord>> {
  // The token database is not mocked, so mock pages render no links.
  if (env.MOCK || tokens.length === 0) {
    return new Map()
  }

  const rows = await getTokenDb().deployedToken.getByChainAndAddress(
    tokens.map((token) => ({
      chain: ChainSpecificAddress.longChain(token.address),
      address: ChainSpecificAddress.address(token.address),
    })),
  )
  return new Map(
    rows.flatMap(({ deployedToken, abstractToken }) =>
      abstractToken
        ? [
            [
              tokenKey(deployedToken.chain, deployedToken.address),
              abstractToken,
            ] as const,
          ]
        : [],
    ),
  )
}

function tokenKey(chain: string, address: string): string {
  return `${chain}:${address.toLowerCase()}`
}
