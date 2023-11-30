import Router from '@koa/router'
import { branded, LivenessType, ProjectId } from '@l2beat/shared-pure'
import { z } from 'zod'

import { LivenessController } from '../controllers/liveness/LivenessController'
import { withTypedContext } from './types'

export function createLivenessRouter(livenessController: LivenessController) {
  const router = new Router()

  router.get('/api/liveness', async (ctx) => {
    const result = await livenessController.getLiveness()

    if (result.type === 'error') {
      ctx.status = 503
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
