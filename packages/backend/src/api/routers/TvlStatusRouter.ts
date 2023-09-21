import Router from '@koa/router'
import { ChainId } from '@l2beat/shared-pure'

import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { AggregatedReportUpdater } from '../../core/reports/AggregatedReportUpdater'
import { TvlSubmodule } from '../../modules/ApplicationModule'
import { renderTvlStatusPage } from '../controllers/status/view/TvlStatusPage'

export function createTvlStatusRouter(
  clock: Clock,
  priceUpdater: PriceUpdater,
  aggregatedReportUpdater: AggregatedReportUpdater,
  submodules: (TvlSubmodule | undefined)[],
) {
  const router = new Router()

  router.get('/status/tvl', (ctx) => {
    ctx.body = renderTvlStatusPage({
      latestSafeTimestamp: clock.getLastHour(),
      statuses: [
        {
          groupName: 'Shared',
          updaters: [
            aggregatedReportUpdater.getStatus(),
            priceUpdater.getStatus(),
          ],
        },
        ...submodules.filter(notUndefined).map((x) => {
          const reports = x.reportUpdaters ?? []
          const data = x.dataUpdaters ?? []

          return {
            groupName: ChainId.getName(reports[0].getChainId()),
            updaters: [
              ...reports.map((r) => r.getStatus()),
              ...data.map((d) => d.getStatus()),
            ],
          }
        }),
      ],
    })
  })

  return router
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
