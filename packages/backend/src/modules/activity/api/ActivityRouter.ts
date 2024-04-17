import Router from '@koa/router'
import { Layer2, layer2s, Layer3, layer3s } from '@l2beat/config'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { ActivityController } from './ActivityController'

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

        const projects: (Layer2 | Layer3)[] = []

        for (const s of slugs) {
          const project = [...layer2s, ...layer3s].find(
            (project) => project.display.slug === s,
          )

          if (!project) {
            ctx.body = {
              result: 'error',
              error: 'UNKNOWN_PROJECT',
            }
            return
          }

          projects.push(project)
        }

        if (!projects.some((p) => p.config.transactionApi)) {
          ctx.body = {
            result: 'error',
            error: 'NO_TRANSACTION_API',
          }
          return
        }

        const data = await activityController.getAggregatedActivity(
          projects.map((p) => p.id),
        )
        ctx.body = data
      },
    ),
  )

  router.get('/api/activity/status', (ctx) => {
    ctx.body = activityController.getStatus()
  })

  return router
}
