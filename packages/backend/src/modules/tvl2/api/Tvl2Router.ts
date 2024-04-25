import Router from '@koa/router'
import { EthereumAddress, ProjectId, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { Clock } from '../../../tools/Clock'
import { Tvl2Controller } from './Tvl2Controller'

export function createTvl2Router(controller: Tvl2Controller, clock: Clock) {
  const router = new Router()

  router.get('/api/tvl2', async (ctx) => {
    const tvl = await controller.getTvl(clock.getLastHour())
    ctx.body = tvl
  })

  router.get(
    '/api/tvl2/token/:project/:chain/:address',
    withTypedContext(
      z.object({
        params: z.object({
          project: stringAs(ProjectId),
          chain: z.string(),
          address: z.string(),
        }),
      }),
      async (ctx) => {
        const { chain, project } = ctx.params
        const address =
          ctx.params.address === 'native'
            ? 'native'
            : EthereumAddress(ctx.params.address)

        ctx.body = await controller.getTokenChart({ chain, address }, project)
      },
    ),
  )
  return router
}
