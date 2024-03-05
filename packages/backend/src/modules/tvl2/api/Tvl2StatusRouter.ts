import Router from '@koa/router'

import { Config } from '../../../config'
import { ChainConverter } from '../../../tools/ChainConverter'
import {
  CirculatingSupplyToken,
  EscrowBalanceToken,
  Token2,
  TotalSupplyToken,
} from '../Token2'
import { renderTokensStatusPage } from './TokensStatusPage'

export function createTvl2StatusRouter(config: Config) {
  const router = new Router()

  const chainConverter = new ChainConverter(config.chains)

  const totalSupplyTokens: TotalSupplyToken[] = config.tokens
    .filter((t) => t.formula === 'totalSupply')
    .map((t) => ({
      type: 'TOTAL_SUPPLY',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      address: t.address!,
      chain: chainConverter.toName(t.chainId),
      sinceTimestamp: t.sinceTimestamp,
      project: chainConverter.toName(t.chainId),
    }))

  const circulatingSupplyTokens: CirculatingSupplyToken[] = config.tokens
    .filter((t) => t.formula === 'circulatingSupply')
    .map((t) => ({
      type: 'CIRCULATING_SUPPLY',
      coingeckoId: t.coingeckoId,
      project: chainConverter.toName(t.chainId),
      sinceTimestamp: t.sinceTimestamp,
    }))

  const escrows = config.projects
    .map((p) => p.escrows.map((e) => ({ ...e, project: p.projectId })))
    .flat()

  const escrowBalanceTokens: EscrowBalanceToken[][] = escrows.map((e) =>
    e.tokens.map((t) => ({
      type: 'ESCROW_BALANCE',
      address: t.address ?? 'native',
      chain: 'ethereum',
      escrow: e.address,
      sinceTimestamp: e.sinceTimestamp,
      project: e.project.toString(),
    })),
  )

  const tokens: Token2[] = [
    ...totalSupplyTokens,
    ...circulatingSupplyTokens,
    ...escrowBalanceTokens.flat(),
  ]

  const tokensByChain: Record<string, Token2[]> = {}

  for (const token of tokens) {
    if (token.type === 'CIRCULATING_SUPPLY') {
      if (tokensByChain['coingecko']) {
        tokensByChain['coingecko'].push(token)
      } else {
        tokensByChain['coingecko'] = [token]
      }
    } else {
      if (tokensByChain[token.chain]) {
        tokensByChain[token.chain].push(token)
      } else {
        tokensByChain[token.chain] = [token]
      }
    }
  }

  const tokensByProject: Record<string, Token2[]> = {}

  for (const token of tokens) {
    if (tokensByProject[token.project]) {
      tokensByProject[token.project].push(token)
    } else {
      tokensByProject[token.project] = [token]
    }
  }

  router.get('/status/tokens', (ctx) => {
    ctx.body = renderTokensStatusPage({
      tokens,
      tokensByChain,
      tokensByProject,
    })
  })

  return router
}
