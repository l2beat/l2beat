import Router from '@koa/router'

import { ReportController } from '../controllers/report/ReportController'

export function createReportRouter(reportController: ReportController) {
  const router = new Router()

  router.get('/api/data', async (ctx) => {
    const data = await reportController.getDaily()
    if (!data) {
      ctx.status = 404
      return
    }
    ctx.body = data
  })

  return router
}
