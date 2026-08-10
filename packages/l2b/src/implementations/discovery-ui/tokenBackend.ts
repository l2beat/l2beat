import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

const TOKENS_URL =
  'https://tokens.l2beat.com/trpc/abstractTokens.getAllWithDeployedTokens,chains.getAll?batch=1'

// Addresses stay as plain strings here: the backend serves ~173 chains and only
// the ones discovery knows about can be turned into a ChainSpecificAddress.
export interface BackendToken {
  chain: string
  address: string
  symbol: string
  decimals: number
  coingeckoId: string
  iconUrl: string | undefined
}

const DeployedToken = v.object({
  chain: v.string(),
  address: v.string(),
  symbol: v.string(),
  decimals: v.number(),
})

const AbstractToken = v.object({
  symbol: v.string(),
  iconUrl: v.union([v.string(), v.null()]),
  coingeckoId: v.string(),
  deployedTokens: v.array(DeployedToken),
})

// The tRPC batch returns one entry per procedure; only the first is used.
const TokensResponse = v.tuple([
  v.object({
    result: v.object({
      data: v.object({ abstractTokens: v.array(AbstractToken) }),
    }),
  }),
  v.unknown(),
])

export async function fetchTokens(): Promise<BackendToken[]> {
  const authToken = process.env.TOKEN_BACKEND_READONLY_AUTH_TOKEN
  assert(
    authToken !== undefined && authToken.length > 0,
    'TOKEN_BACKEND_READONLY_AUTH_TOKEN is not set',
  )

  const response = await fetch(TOKENS_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: authToken },
    body: '{}',
  })
  assert(
    response.status === 200,
    `Token backend responded with ${response.status}`,
  )

  const [tokens] = TokensResponse.parse(await response.json())
  return tokens.result.data.abstractTokens.flatMap((abstractToken) =>
    abstractToken.deployedTokens.map(
      (deployed): BackendToken => ({
        chain: deployed.chain,
        address: deployed.address,
        symbol: deployed.symbol,
        decimals: deployed.decimals,
        coingeckoId: abstractToken.coingeckoId,
        iconUrl: abstractToken.iconUrl ?? undefined,
      }),
    ),
  )
}
