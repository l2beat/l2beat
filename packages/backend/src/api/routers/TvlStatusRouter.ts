import Router from '@koa/router'
import { z } from 'zod'

import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { AggregatedReportUpdater } from '../../core/reports/AggregatedReportUpdater'
import { TvlSubmodule } from '../../modules/ApplicationModule'
import {
  getSyncStatus,
  renderTvlStatusPage,
} from '../controllers/status/view/TvlStatusPage'
import { renderTvlStatusPageDetailed } from '../controllers/status/view/TvlStatusPageDetailed'
import { withTypedContext } from './types'

export function createTvlStatusRouter(
  clock: Clock,
  priceUpdater: PriceUpdater,
  aggregatedReportUpdater: AggregatedReportUpdater,
  submodules: TvlSubmodule[],
) {
  const router = new Router()

  const statuses = [
    {
      groupName: 'shared',
      updaters: [aggregatedReportUpdater, priceUpdater],
    },
    ...submodules.map((x) => {
      const reports = x.reportUpdaters ?? []
      const data = x.dataUpdaters ?? []

      return {
        groupName: x.chain,
        updaters: [...reports, ...data],
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
