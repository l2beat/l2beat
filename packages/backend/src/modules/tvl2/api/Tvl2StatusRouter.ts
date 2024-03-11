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
    const byType = groupBy(amounts, 'type')
    const byChain = groupBy(amounts, 'chain')
    const byProject = groupBy(amounts, 'project')

    ctx.body = {
      prices: {
        entries: prices.length,
        datapoints: getDatapoints(prices, clock),
      },
      amounts: {
        entries: amounts.length,
        datapoints: getDatapoints(amounts, clock),
        chains: Object.keys(byChain).length,
        projects: Object.keys(byProject).length,
        totalSupplies: {
          entries: byType['totalSupply'].length,
          datapoints: getDatapoints(byType['totalSupply'], clock),
        },
        circulatingSupplies: {
          entries: byType['circulatingSupply'].length,
          datapoints: getDatapoints(byType['circulatingSupply'], clock),
        },
        escrows: {
          entries: byType['escrow'].length,
          datapoints: getDatapoints(byType['escrow'], clock),
        },
      },
    }
  })

  return router
}

function getDatapoints(entries: { sinceTimestamp: UnixTime }[], clock: Clock) {
  return entries.reduce((sum, a) => (sum += getTargetDataPoints(a, clock)), 0)
}
