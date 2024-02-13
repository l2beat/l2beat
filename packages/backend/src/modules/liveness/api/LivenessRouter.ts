import Router from '@koa/router'
import { branded, LivenessType, ProjectId } from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { Config } from '../../../config'
import { LivenessController } from './LivenessController'

export function createLivenessRouter(
  livenessController: LivenessController,
  config: Config,
) {
  const router = new Router()

  router.get('/api/liveness', async (ctx) => {
    const result = config.api.cache.liveness
      ? await livenessController.getCachedLivenessApiResponse()
      : await livenessController.getLiveness()

    if (result.type === 'error') {
      ctx.status = 404
      ctx.body = result.error
      return
    }
    ctx.body = result.data
  })

  router.get('/api/liveness-transactions', async (ctx) => {
    const result = await livenessController.getLivenessTransactions()

    if (result.type === 'error') {
      ctx.status = 404
      ctx.body = result.error
      return
    }
    ctx.body = result.data
  })

  router.get(
    '/api/liveness/:projectId/:livenessType',
    withTypedContext(
      z.object({
        params: z.object({
          projectId: branded(z.string(), ProjectId),
          livenessType: branded(z.string(), LivenessType),
        }),
      }),
      async (ctx) => {
        const { livenessType, projectId } = ctx.params

        ctx.body = await livenessController.getLivenessPerProjectAndType(
          projectId,
          livenessType,
        )
      },
    ),
  )

  return router
}
