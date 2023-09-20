import Router from '@koa/router'

import { Clock } from '../../core/Clock'
import {
  renderTvlStatusPage,
  UpdaterStatus,
} from '../controllers/status/view/TvlStatusPage'

interface Updater {
  getStatus(): UpdaterStatus
}

export function createTvlStatusRouter(clock: Clock, updaters: Updater[]) {
  const router = new Router()

  router.get('/status/tvl', async (ctx) => {
    ctx.body = renderTvlStatusPage({
      latestSafeTimestamp: clock.getLastHour(),
      statuses: await Promise.all(updaters.map((x) => x.getStatus())),
    })
  })

  return router
}
