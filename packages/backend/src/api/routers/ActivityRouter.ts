import Router from '@koa/router'
import { z } from 'zod'

import { Config } from '../../config'
import { Project } from '../../model'
import { ActivityController } from '../controllers/activity/ActivityController'
import { withTypedContext } from './types'

export function createActivityRouter(
  activityController: ActivityController,
  config: Config,
) {
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
        if (ctx.query.projectSlugs.length === 0) {
          ctx.body = {
            result: 'error',
            error: 'EMPTY_PROJECTS',
          }
          return
        }

        const slugs = ctx.query.projectSlugs
          .split(',')
          .map((slug) => slug.trim())

        const projects: Project[] = []

        for (const s of slugs) {
          const project = config.projects.find((project) => project.slug === s)

          if (!project) {
            ctx.body = {
              result: 'error',
              error: 'UNKNOWN_PROJECT',
            }
            return
          }

          projects.push(project)
        }

        if (!projects.some((p) => p.transactionApi)) {
          ctx.body = {
            result: 'error',
            error: 'NO_TRANSACTION_API',
          }
          return
        }

        const data = await activityController.getAggregatedActivity(
          projects.map((p) => p.projectId),
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
