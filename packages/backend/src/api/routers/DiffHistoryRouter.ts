import Router from '@koa/router'
import { z } from 'zod'

import { DiffHistoryController } from '../controllers/diff-history/DiffHistoryController'
import { withTypedContext } from './types'

export function createDiffHistoryRouter(controller: DiffHistoryController) {
  const router = new Router()

  router.get(
    '/diff-history/raw/:chain/:project',
    withTypedContext(
      z.object({
        params: z.object({
          chain: z.string(),
          project: z.string(),
        }),
      }),
      async (ctx) => {
        ctx.body = await controller.getRaw(ctx.params.chain, ctx.params.project)
      },
    ),
  )

  router.get('/diff-history', async (ctx) => {
    ctx.body = await controller.getAllDiffHistories()
  })

  router.get(
    '/diff-history/:chain/:project',
    withTypedContext(
      z.object({
        params: z.object({
          chain: z.string(),
          project: z.string(),
        }),
      }),
      async (ctx) => {
        ctx.body = await controller.getDiffHistoryPerProject(
          ctx.params.chain,
          ctx.params.project,
        )
      },
    ),
  )

  return router
}
