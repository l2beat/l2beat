import Router from '@koa/router'
import { TokenQuery } from '@l2beat/shared-pure'

import { renderTokensStatusPage } from './TokensStatusPage'

export function createTvl2StatusRouter(tokens: TokenQuery[]) {
  const router = new Router()

  const tokensByChain: Record<string, TokenQuery[]> = {}

  for (const token of tokens) {
    if (token.amount.type === 'circulatingSupply') {
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

  const tokensByProject: Record<string, TokenQuery[]> = {}

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
