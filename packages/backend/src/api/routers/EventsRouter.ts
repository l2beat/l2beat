import Router from '@koa/router'

import { EventsController } from '../controllers/events/EventsController'

export function createEventsRouter(eventsController: EventsController) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    const data = await eventsController.getEvents()

    ctx.body = data
  })

  router.get('/api/events/showcase', async (ctx) => {
    const data = await eventsController.getShowcase()

    ctx.body = data
  })

  return router
}
