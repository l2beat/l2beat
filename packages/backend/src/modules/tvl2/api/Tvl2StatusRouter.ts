import Router from '@koa/router'
import { TokenQuery, UnixTime } from '@l2beat/shared-pure'

import { Config } from '../../../config'
import { Clock } from '../../../tools/Clock'
import { renderTokensStatusPage } from './TokensStatusPage'

interface TokenQueryWithDatapoints extends TokenQuery {
  dataPoints: number
}

export function createTvl2StatusRouter(config: Config, clock: Clock) {
  const router = new Router()

  const tokensByChain: Record<string, TokenQueryWithDatapoints[]> = {}

  for (const token of config.queries) {
    if (token.amount.type === 'circulatingSupply') {
      if (tokensByChain['coingecko']) {
        tokensByChain['coingecko'].push({
          ...token,
          dataPoints: getDataPoints(token, clock),
        })
      } else {
        tokensByChain['coingecko'] = [
          { ...token, dataPoints: getDataPoints(token, clock) },
        ]
      }
    } else {
      if (tokensByChain[token.chain]) {
        tokensByChain[token.chain].push({
          ...token,
          dataPoints: getDataPoints(token, clock),
        })
      } else {
        tokensByChain[token.chain] = [
          { ...token, dataPoints: getDataPoints(token, clock) },
        ]
      }
    }
  }

  const tokensByProject: Record<string, TokenQueryWithDatapoints[]> = {}

  for (const token of config.queries) {
    if (tokensByProject[token.project]) {
      tokensByProject[token.project].push({
        ...token,
        dataPoints: getDataPoints(token, clock),
      })
    } else {
      tokensByProject[token.project] = [
        { ...token, dataPoints: getDataPoints(token, clock) },
      ]
    }
  }

  router.get('/status/tokens', (ctx) => {
    ctx.body = renderTokensStatusPage({
      tokens: config.queries.map((t) => ({
        ...t,
        dataPoints: getDataPoints(t, clock),
      })),
      tokensByChain,
      tokensByProject,
    })
  })

  return router
}

function getDataPoints(token: TokenQuery, clock: Clock) {
  const calls: UnixTime[] = []
  const stop = clock._TVL_ONLY_onEveryHour((timestamp) => calls.push(timestamp))
  stop()
  return calls.filter((t) => t.gte(token.sinceTimestamp)).length
}
