import type { Branded } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'

export type AbstractTokenId = Branded<string, 'AbstractTokenId'>

export function AbstractTokenId(id: string) {
  return id as AbstractTokenId
}

AbstractTokenId.from = function from(
  realId: string,
  issuer: string,
  symbol: string,
) {
  return AbstractTokenId(`${realId}:${issuer}:${symbol}`)
}

AbstractTokenId.realId = function readId(id: AbstractTokenId) {
  return id.slice(0, 6)
}

AbstractTokenId.issuer = function issuer(id: AbstractTokenId) {
  const withoutRealId = id.slice(7)
  return withoutRealId.slice(0, withoutRealId.indexOf(':'))
}

AbstractTokenId.symbol = function symbol(id: AbstractTokenId) {
  const withoutRealId = id.slice(7)
  return withoutRealId.slice(withoutRealId.indexOf(':') + 1)
}

export type DeployedTokenId = Branded<string, 'AbstractTokenId'>

export function DeployedTokenId(id: string) {
  return id as DeployedTokenId
}

DeployedTokenId.from = function from(chain: string, address: string) {
  return `${chain}+${address}` as DeployedTokenId
}

DeployedTokenId.chain = function chain(id: DeployedTokenId) {
  return id.slice(0, id.indexOf('+'))
}

DeployedTokenId.address = function address(id: DeployedTokenId) {
  return id.slice(id.indexOf('+') + 1)
}

export type PriceInfo = Map<
  DeployedTokenId,
  {
    abstractId: AbstractTokenId
    decimals: number
    coingeckoId: string
  }
>

export class TokenDb {
  constructor(private readonly tokenDbClient: TokenDbClient) {}

  async getPriceInfo(deployedTokens: DeployedTokenId[]) {
    const result: PriceInfo = new Map()

    for (const t of deployedTokens) {
      const tokenData =
        await this.tokenDbClient.tokens.getByChainAndAddress.query({
          chain: DeployedTokenId.chain(t),
          address: DeployedTokenId.address(t),
        })
      const { deployed, abstract } = tokenData
      if (!deployed || !abstract || !abstract.coingeckoId) {
        continue
      }

      result.set(t, {
        abstractId: AbstractTokenId.from(
          abstract.id,
          abstract.issuer ?? '',
          abstract.symbol,
        ),
        coingeckoId: abstract.coingeckoId,
        decimals: deployed.decimals,
      })
    }
    return result
  }
}
