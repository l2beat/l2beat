import Router from '@koa/router'
import { z } from 'zod'

import { ActivityController } from '../controllers/activity/ActivityController'
import { withTypedContext } from './types'

export function createActivityRouter(activityController: ActivityController) {
  const router = new Router()

  router.get('/api/activity', async (ctx) => {
    const data = await activityController.getActivity()
    ctx.body = data
  })

  router.get(
    '/api/activity/aggregate',
    withTypedContext(
      z.object({
        query: z.object({
          projectSlugs: z.string(),
        }),
      }),
      async (ctx) => {
        const projectSlugs = ctx.query.projectSlugs
        const data = await activityController.getProjectsActivity(
          projectSlugs.split(',').map((slug) => slug.trim()),
        )
        ctx.body = data
      },
    ),
  )

  router.get('/api/activity/status', async (ctx) => {
    const data = await activityController.getStatus()
    ctx.body = data
  })

  return router
}
