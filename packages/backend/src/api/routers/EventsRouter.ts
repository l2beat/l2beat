import Router from '@koa/router'

import { EventsController } from '../controllers/EventsController'

export function createEventsRouter(eventsController: EventsController) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    const data = await eventsController.getMain()

    ctx.body = data
  })

  return router
}
