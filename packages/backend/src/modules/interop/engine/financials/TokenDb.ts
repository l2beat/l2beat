import type { Logger } from '@l2beat/backend-tools'
import type { TokenDbClient } from '@l2beat/token-backend'
import { DeployedTokenId } from './DeployedTokenId'

export type TokenInfos = Map<
  DeployedTokenId,
  {
    abstractId: string
    symbol: string
    decimals: number
    coingeckoId: string
  }
>

export class TokenDb {
  constructor(
    private readonly tokenDbClient: TokenDbClient,
    private logger: Logger,
  ) {}

  async getTokenInfos(deployedTokens: DeployedTokenId[]) {
    const result: TokenInfos = new Map()

    const tokens = await this.tokenDbClient.tokens.getByChainAndAddress.query(
      deployedTokens.map((d) => ({
        chain: DeployedTokenId.chain(d),
        address: DeployedTokenId.address(d),
      })),
    )

    const tokensMap = new Map(
      tokens.map((t) => [
        DeployedTokenId.from(t.deployedToken.chain, t.deployedToken.address),
        t,
      ]),
    )

    for (const d of deployedTokens) {
      const tokenData = tokensMap.get(d)

      if (!tokenData) {
        this.logger.info('Missing token detected', { deployedTokenId: d })
        continue
      }

      const { deployedToken, abstractToken } = tokenData

      if (!abstractToken) {
        this.logger.info('Missing abstract token', { deployedTokenId: d })
        continue
      }

      if (!abstractToken.coingeckoId) {
        this.logger.info('Missing coingeckoId', {
          deployedTokenId: d,
          abstractToken,
        })
        continue
      }

      result.set(d, {
        abstractId: abstractToken.id,
        symbol: deployedToken.symbol,
        coingeckoId: abstractToken.coingeckoId,
        decimals: deployedToken.decimals,
      })
    }

    return result
  }
}
