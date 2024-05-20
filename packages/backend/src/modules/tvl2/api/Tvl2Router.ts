import Router from '@koa/router'
import { EthereumAddress, ProjectId, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { Clock } from '../../../tools/Clock'
import { Tvl2Controller } from './Tvl2Controller'

export function createTvl2Router(controller: Tvl2Controller, clock: Clock) {
  const router = new Router()

  router.get('/api/tvl2', async (ctx) => {
    const tvl = await controller.getTvl(clock.getLastHour().add(-1, 'hours'))
    ctx.body = tvl
  })

  router.get(
    '/api/tvl2/aggregate',
    withTypedContext(
      z.object({
        query: z.object({
          projectSlugs: z.string(),
        }),
      }),
      async (ctx) => {
        const projectSlugs = ctx.query.projectSlugs
          .split(',')
          .map((slug) => slug.trim())

        const tvl = await controller.getAggregatedTvl(
          clock.getLastHour().add(-1, 'hours'),
          projectSlugs,
        )
        ctx.body = tvl
      },
    ),
  )

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
    const breakdown = await controller.getTvlBreakdown(
      clock.getLastHour().add(-1, 'hours'),
    )

    ctx.body = breakdown
  })

  return router
}
