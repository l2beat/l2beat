import Router from '@koa/router'

import { EventUpdater } from '../../core/EventUpdater'


export function createEventsRouter(eventUpdater: EventUpdater) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    await eventUpdater.update()
    ctx.body = 'logs'
  })

  return router
}
