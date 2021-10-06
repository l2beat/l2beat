import Router from '@koa/router'

import { ReportCreator } from '../report/ReportCreator'

export function createReportRouter(reportCreator: ReportCreator) {
  const router = new Router()

  router.get('/report', async (ctx) => {
    const report = reportCreator.getReport()
    ctx.body = {
      report:
        report?.map((x) => ({
          time: x.timestamp.toDate().toISOString(),
          blockNumber: x.blockNumber.toString(),
        })) ?? null,
    }
  })

  return router
}
