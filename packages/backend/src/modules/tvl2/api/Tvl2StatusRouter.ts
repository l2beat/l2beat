import Router from '@koa/router'
import {
  ChainId,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'

import { Config } from '../../../config'

type Token = TotalSupplyToken | CirculatingSupplyToken | EscrowBalanceToken

interface EscrowBalanceToken {
  type: 'ESCROW_BALANCE'
  address: EthereumAddress | 'native'
  chainId: ChainId
  escrow: EthereumAddress
  sinceTimestamp: UnixTime
}

interface TotalSupplyToken {
  type: 'TOTAL_SUPPLY'
  address: EthereumAddress
  chainId: ChainId
  sinceTimestamp: UnixTime
}

interface CirculatingSupplyToken {
  type: 'CIRCULATING_SUPPLY'
  coingeckoId: CoingeckoId
  sinceTimestamp: UnixTime
}

export function createTvl2StatusRouter(config: Config) {
  const router = new Router()

  const totalSupplyTokens: TotalSupplyToken[] = config.tokens
    .filter((t) => t.formula === 'totalSupply')
    .map((t) => ({
      type: 'TOTAL_SUPPLY',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      address: t.address!,
      chainId: t.chainId,
      sinceTimestamp: t.sinceTimestamp,
    }))

  const circulatingSupplyTokens: CirculatingSupplyToken[] = config.tokens
    .filter((t) => t.formula === 'circulatingSupply')
    .map((t) => ({
      type: 'CIRCULATING_SUPPLY',
      coingeckoId: t.coingeckoId,
      sinceTimestamp: t.sinceTimestamp,
    }))

  const escrows = config.projects.map((p) => p.escrows).flat()

  const escrowBalanceTokens: EscrowBalanceToken[][] = escrows.map((e) =>
    e.tokens.map((t) => ({
      type: 'ESCROW_BALANCE',
      address: t.address ?? 'native',
      chainId: t.chainId,
      escrow: e.address,
      sinceTimestamp: e.sinceTimestamp,
    })),
  )

  const tokens: Token[] = [
    ...totalSupplyTokens,
    ...circulatingSupplyTokens,
    ...escrowBalanceTokens.flat(),
  ]

  router.get('/status/tokens', (ctx) => {
    ctx.body = tokens
  })

  return router
}
