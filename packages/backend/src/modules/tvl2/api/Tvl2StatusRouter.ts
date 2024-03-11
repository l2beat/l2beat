import Router from '@koa/router'
import { TokenQuery } from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { Tvl2Config } from '../../../config/Config'
import { Clock } from '../../../tools/Clock'
import { renderTokensStatusPage } from './TokensStatusPage'

export interface TokenQueryWithTarget extends TokenQuery {
  targetDataPoints: number
}

export function createTvl2StatusRouter(config: Tvl2Config, clock: Clock) {
  const router = new Router()

  router.get('/status/tokens', (ctx) => {
    ctx.body = renderTokensStatusPage({
      tokens: config.queries.map((t) => ({
        ...t,
        targetDataPoints: getTargetDataPoints(t, clock),
      })),
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

export function getTargetDataPoints(token: TokenQuery, clock: Clock) {
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
