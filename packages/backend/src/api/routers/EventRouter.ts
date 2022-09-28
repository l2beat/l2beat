import Router from '@koa/router'

import { EventController } from '../controllers/event/EventController'

export function createEventRouter(eventController: EventController) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    const data = await eventController.getEventApiResponse()

    ctx.body = data
  })

  router.get('/api/events/showcase', async (ctx) => {
    const data = await eventController.getShowcase()

    ctx.body = data
  })

  return router
}
