import Router from '@koa/router'

import { Clock } from '../../core/Clock'
import {
  renderTvlStatusPage,
  UpdaterStatus,
} from '../controllers/status/view/TvlStatusPage'

interface Updater {
  getStatus(): UpdaterStatus
}

export function createTvlStatusRouter(
  clock: Clock,
  updaterGroups: {
    updaters: Updater[]
    groupName: string
  }[],
) {
  const router = new Router()

  router.get('/status/tvl', (ctx) => {
    ctx.body = renderTvlStatusPage({
      latestSafeTimestamp: clock.getLastHour(),
      statuses: updaterGroups.map((x) => {
        return {
          groupName: x.groupName,
          updaters: x.updaters.map((updater) => updater.getStatus()),
        }
      }),
    })
  })

  return router
}
