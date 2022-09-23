import Router from '@koa/router'

import { EventController } from '../controllers/events/EventsController'

export function createEventsRouter(eventController: EventController) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    const data = await eventController.getEvents()

    ctx.body = data
  })

  router.get('/api/events/showcase', async (ctx) => {
    const data = await eventController.getShowcase()

    ctx.body = data
  })

  return router
}
