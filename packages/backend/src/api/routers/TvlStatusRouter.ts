import Router from '@koa/router'

import { AggregatedReportUpdater } from '../../core/reports/AggregatedReportUpdater'
import { renderStatusXPage } from '../controllers/status/view/StatusXPage'

export function createTvlStatusRouter(aggregate: AggregatedReportUpdater) {
  const router = new Router()

  router.get('/status-x', async (ctx) => {
    const s = await aggregate.getStatus()
    console.log('sss')
    ctx.body = renderStatusXPage({
      statuses: [s],
    })
  })

  return router
}
