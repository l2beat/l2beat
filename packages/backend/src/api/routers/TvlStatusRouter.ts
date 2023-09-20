import Router from '@koa/router'

import { Clock } from '../../core/Clock'
import {
  renderStatusXPage,
  UpdaterStatus,
} from '../controllers/status/view/StatusXPage'

interface Updater {
  getStatus(): Promise<UpdaterStatus>
}

export function createTvlStatusRouter(clock: Clock, updaters: Updater[]) {
  const router = new Router()

  router.get('/status-x', async (ctx) => {
    ctx.body = renderStatusXPage({
      latestSafeTimestamp: clock.getLastHour(),
      statuses: await Promise.all(updaters.map((x) => x.getStatus())),
    })
  })

  return router
}
