import Router from '@koa/router'
import { TokenQuery } from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { Config } from '../../../config'
import { Clock } from '../../../tools/Clock'
import { renderTokensStatusPage } from './TokensStatusPage'

export interface TokenQueryWithTarget extends TokenQuery {
  targetDataPoints: number
}

export function createTvl2StatusRouter(config: Config, clock: Clock) {
  const router = new Router()

  const tokensByChain: Record<string, TokenQueryWithTarget[]> = {}

  for (const token of config.queries) {
    if (token.amount.type === 'circulatingSupply') {
      if (tokensByChain['coingecko']) {
        tokensByChain['coingecko'].push({
          ...token,
          targetDataPoints: getTargetDataPoints(token, clock),
        })
      } else {
        tokensByChain['coingecko'] = [
          { ...token, targetDataPoints: getTargetDataPoints(token, clock) },
        ]
      }
    } else {
      if (tokensByChain[token.chain]) {
        tokensByChain[token.chain].push({
          ...token,
          targetDataPoints: getTargetDataPoints(token, clock),
        })
      } else {
        tokensByChain[token.chain] = [
          { ...token, targetDataPoints: getTargetDataPoints(token, clock) },
        ]
      }
    }
  }

  const tokensByProject: Record<string, TokenQueryWithTarget[]> = {}

  for (const token of config.queries) {
    if (tokensByProject[token.project]) {
      tokensByProject[token.project].push({
        ...token,
        targetDataPoints: getTargetDataPoints(token, clock),
      })
    } else {
      tokensByProject[token.project] = [
        { ...token, targetDataPoints: getTargetDataPoints(token, clock) },
      ]
    }
  }

  router.get('/status/tokens', (ctx) => {
    ctx.body = renderTokensStatusPage({
      tokens: config.queries.map((t) => ({
        ...t,
        targetDataPoints: getTargetDataPoints(t, clock),
      })),
      tokensByChain,
      tokensByProject,
    })
  })

  router.get(
    '/status/tokens/list',
    withTypedContext(
      z.object({
        query: z.object({
          chain: z.string().optional(),
          project: z.string().optional(),
        }),
      }),
      (ctx) => {
        const filteredByChain = config.queries.filter((t) =>
          ctx.query.chain ? t.chain === ctx.query.chain : true,
        )

        const filteredByProject = filteredByChain.filter((t) =>
          ctx.query.project ? t.project === ctx.query.project : true,
        )

        ctx.body = JSON.stringify(filteredByProject)
      },
    ),
  )

  return router
}

function getTargetDataPoints(token: TokenQuery, clock: Clock) {
  const start = token.sinceTimestamp.gt(clock.getFirstHour())
    ? token.sinceTimestamp
    : clock.getFirstHour()

  const sixHourlyBoundary = clock
    ._TVL_ONLY_getSixHourlyDeletionBoundary()
    .gt(start)
    ? clock._TVL_ONLY_getSixHourlyDeletionBoundary()
    : start

  const hourlyBoundary = clock._TVL_ONLY_getHourlyDeletionBoundary().gt(start)
    ? clock._TVL_ONLY_getHourlyDeletionBoundary()
    : start

  const end = clock.getLastHour()

  const dailyDiff =
    sixHourlyBoundary.toStartOf('day').toNumber() -
    start.toEndOf('day').toNumber()

  const dailyDataPoints = dailyDiff > 0 ? Math.floor(dailyDiff / 86400) : 0

  const sixHourlyDiff =
    hourlyBoundary.toStartOf('six hours').toNumber() -
    sixHourlyBoundary.toEndOf('six hours').toNumber()

  const sixHourlyDataPoints =
    sixHourlyDiff > 0 ? Math.floor(sixHourlyDiff / 21600) : 0

  const hourlyDiff = end.toNumber() - hourlyBoundary.toEndOf('hour').toNumber()

  const hourlyDataPoints =
    hourlyDiff > 0 ? Math.floor(hourlyDiff / 3600) + 1 : 0

  return dailyDataPoints + sixHourlyDataPoints + hourlyDataPoints
}
