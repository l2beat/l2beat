import Router from '@koa/router'
import { EthereumAddress, ProjectId, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { Clock } from '../../../tools/Clock'
import { Tvl2Controller } from './Tvl2Controller'

export function createTvl2Router(controller: Tvl2Controller, clock: Clock) {
  const router = new Router()

  router.get('/api/tvl2', async (ctx) => {
    const tvl = await controller.getOldTvl(clock.getLastHour())
    ctx.body = tvl
  })

  router.get(
    '/api/tvl2/token',
    withTypedContext(
      z.object({
        query: z.object({
          project: stringAs(ProjectId),
          chain: z.string(),
          address: z.string(),
        }),
      }),
      async (ctx) => {
        const { chain, project } = ctx.query
        const address =
          ctx.query.address === 'native'
            ? 'native'
            : EthereumAddress(ctx.query.address)

        ctx.body = await controller.getTokenChart({ chain, address }, project)
      },
    ),
  )

  router.get('/api/tvl2/breakdown', async (ctx) => {
    const breakdown = await controller.getTvlBreakdown(clock.getLastHour())

    ctx.body = breakdown
  })

  return router
}
