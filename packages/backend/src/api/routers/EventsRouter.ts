import Router from '@koa/router'

import { EventsController } from '../controllers/events/EventsController'

export function createEventsRouter(eventController: EventsController) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    const data = await eventController.getEventsResponse()

    ctx.body = data
  })

  router.get('/api/events/showcase', async (ctx) => {
    const data = await eventController.getShowcase()

    ctx.body = data
  })

  return router
}
