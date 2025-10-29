import type { Branded } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'

export type DeployedTokenId = Branded<string, 'DeployedTokenId'>

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
    abstractId: string
    symbol: string
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
        abstractId: abstract.id,
        symbol: abstract.symbol,
        coingeckoId: abstract.coingeckoId,
        decimals: deployed.decimals,
      })
    }
    return result
  }
}
