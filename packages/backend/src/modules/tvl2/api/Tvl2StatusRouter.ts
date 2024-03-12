import Router from '@koa/router'
import { UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Clock } from '../../../tools/Clock'
import { getTargetDataPoints } from './getTargetDataPoints'

export function createTvl2StatusRouter(
  { amounts, prices }: Tvl2Config,
  clock: Clock,
) {
  const router = new Router()

  router.get('/status/tokens', (ctx) => {
    const pricesByType = groupBy(prices, 'type')

    const amountsByType = groupBy(amounts, 'type')
    const amountsByChain = groupBy(amounts, 'chain')
    const amountsByProject = groupBy(amounts, 'project')

    ctx.body = {
      prices: {
        entries: prices.length,
        datapoints: getDatapoints(prices, clock),
        byType: Object.entries(pricesByType).map(([type, entries]) => ({
          type,
          entries: entries.length,
          datapoints: getDatapoints(entries, clock),
        })),
      },
      amounts: {
        entries: amounts.length,
        datapoints: getDatapoints(amounts, clock),
        chains: Object.keys(amountsByChain).length,
        projects: Object.keys(amountsByProject).length,
        byType: Object.entries(amountsByType).map(([type, entries]) => ({
          type,
          entries: entries.length,
          datapoints: getDatapoints(entries, clock),
        })),
      },
    }
  })

  return router
}

function getDatapoints(entries: { sinceTimestamp: UnixTime }[], clock: Clock) {
  return entries.reduce((sum, a) => (sum += getTargetDataPoints(a, clock)), 0)
}
