import Router from '@koa/router'
import { ChainId } from '@l2beat/shared-pure'
import { z } from 'zod'

import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { AggregatedReportUpdater } from '../../core/reports/AggregatedReportUpdater'
import { TvlSubmodule } from '../../modules/ApplicationModule'
import { renderTvlStatusPage } from '../controllers/status/view/TvlStatusPage'
import { renderTvlStatusPageDetailed } from '../controllers/status/view/TvlStatusPageDetailed'
import { withTypedContext } from './types'

const paramsParser = z.object({
  params: z.object({
    group: z.string(),
    updater: z.string(),
  }),
})

export function createTvlStatusRouter(
  clock: Clock,
  priceUpdater: PriceUpdater,
  aggregatedReportUpdater: AggregatedReportUpdater,
  submodules: (TvlSubmodule | undefined)[],
) {
  const router = new Router()

  const s = {
    statuses: [
      {
        groupName: 'shared',
        updaters: [aggregatedReportUpdater, priceUpdater],
      },
      ...submodules.filter(notUndefined).map((x) => {
        const reports = x.reportUpdaters ?? []
        const data = x.dataUpdaters ?? []

        return {
          groupName: ChainId.getName(reports[0].getChainId()),
          updaters: [...reports, ...data],
        }
      }),
    ],
  }

  router.get('/status/tvl', (ctx) => {
    ctx.body = renderTvlStatusPage({
      latestSafeTimestamp: clock.getLastHour(),
      statuses: s.statuses.map((x) => ({
        groupName: x.groupName,
        updaters: x.updaters.map((x) => ({
          ...x.getStatus(),
        })),
      })),
    })
  })

  router.get(
    '/status/tvl/detailed/:group/:updater',
    withTypedContext(paramsParser, (ctx) => {
      const { group, updater } = ctx.params
      ctx.body = renderTvlStatusPageDetailed({
        latestSafeTimestamp: clock.getLastHour(),
        status: {
          groupName: group,
          updater: s.statuses
            .find((x) => x.groupName === group)
            ?.updaters.find((x) => x.getStatus().updaterName === updater)
            ?.getStatus(),
        },
      })
    }),
  )
  return router
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
