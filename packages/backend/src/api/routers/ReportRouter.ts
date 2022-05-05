import Router from '@koa/router'

import { ReportController } from '../controllers/report/ReportController'

export function createReportRouter(reportController: ReportController) {
  const router = new Router()

  router.get('/api/data', async (ctx) => {
    ctx.body = await reportController.getDaily()
  })

  return router
}
