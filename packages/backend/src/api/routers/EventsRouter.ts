import Router from '@koa/router'

import { EventUpdater } from '../../core/events/EventUpdater'

export function createEventsRouter(eventUpdater: EventUpdater) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    ctx.body = JSON.stringify(await eventUpdater.fetchStateUpdates())
  })

  return router
}
