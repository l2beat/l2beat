import Router from '@koa/router'
import { ChainId } from '@l2beat/shared-pure'
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

  const statuses = [
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
    // @ts-expect-error inner function doest not return Promise
    withTypedContext(paramsParser, (ctx) => {
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
    }),
  )
  return router
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
