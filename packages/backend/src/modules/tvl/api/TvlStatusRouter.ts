import Router from '@koa/router'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { Clock } from '../../../tools/Clock'
import { TvlModule } from '../modules/types'
import { PriceUpdater } from '../PriceUpdater'
import { AggregatedReportUpdater } from '../reports/AggregatedReportUpdater'
import { getSyncStatus, renderTvlStatusPage } from './status/TvlStatusPage'
import { renderTvlStatusPageDetailed } from './status/TvlStatusPageDetailed'

export function createTvlStatusRouter(
  clock: Clock,
  priceUpdater: PriceUpdater,
  aggregatedReportUpdater: AggregatedReportUpdater,
  modules: TvlModule[],
) {
  const router = new Router()

  const statuses = [
    {
      groupName: 'shared',
      updaters: [priceUpdater, aggregatedReportUpdater],
    },
    ...modules.map((x) => {
      const reports = x.reportUpdaters ?? []
      const data = x.dataUpdaters ?? []

      return {
        groupName: x.chain,
        updaters: [...data, ...reports],
      }
    }),
  ]

  router.get('/status/tvl', (ctx) => {
    ctx.body = renderTvlStatusPage({
      latestSafeTimestamp: clock.getLastHour(),
      statuses: statuses.map((x) => ({
        groupName: x.groupName,
        updaters: x.updaters.map((x) => ({
          ...x.getStatus(),
        })),
      })),
      aggregatedStatus: getSyncStatus(
        aggregatedReportUpdater.getStatus().statuses,
      ),
    })
  })

  router.get(
    '/status/tvl/:group/:updater',
    withTypedContext(
      z.object({
        params: z.object({
          group: z.string(),
          updater: z.string(),
        }),
      }),
      (ctx) => {
        const { group, updater } = ctx.params
        ctx.body = renderTvlStatusPageDetailed({
          latestSafeTimestamp: clock.getLastHour(),
          status: {
            groupName: group,
            updater: statuses
              .find((x) => x.groupName === group)
              ?.updaters.find((x) => x.getStatus().updaterName === updater)
              ?.getStatus(),
          },
        })
      },
    ),
  )
  return router
}
