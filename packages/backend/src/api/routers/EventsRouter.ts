import Router from '@koa/router'
import { branded, ProjectId } from '@l2beat/common'
import { z } from 'zod'

import { EventsController } from '../controllers/EventsController'
import { withTypedContext } from './types'


export function createEventsRouter(eventsController: EventsController) {
  const router = new Router()

  router.get(
    '/api/projects/:projectId/events/:eventName',
    withTypedContext(
      z.object({
        params: z.object({
          projectId: branded(z.string(), ProjectId),
          eventName: z.string(),
        }),
      }),
      async (ctx) => {
        const { projectId, eventName } = ctx.params
        const events = await eventsController.getByProjectByEvent(
          projectId,
          eventName,
        )
        if (!events) {
          ctx.status = 404
          return
        }
        ctx.body = events
      },
    ),
  )

  return router
}
