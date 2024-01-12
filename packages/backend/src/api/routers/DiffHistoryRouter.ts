import Router from '@koa/router'
import { ChainId, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

import { DiffHistoryController } from '../controllers/diff-history/DiffHistoryController'
import { withTypedContext } from './types'

const paramsParser = z.object({
  params: z.object({
    chainId: stringAs((s) => ChainId.fromName(s)),
    project: z.string(),
  }),
})

export function createDiffHistoryRouter(controller: DiffHistoryController) {
  const router = new Router()

  router.get(
    '/diff-history/raw/:chainId/:project',
    withTypedContext(paramsParser, async (ctx) => {
      const { chainId, project } = ctx.params
      ctx.body = await controller.getRaw(chainId, project)
    }),
  )

  router.get(
    '/diff-history/:chainId/:project',
    withTypedContext(paramsParser, async (ctx) => {
      const { chainId, project } = ctx.params
      ctx.body = await controller.getDiff(chainId, project)
    }),
  )

  return router
}
