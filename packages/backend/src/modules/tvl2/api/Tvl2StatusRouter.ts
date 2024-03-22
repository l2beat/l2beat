import Router from '@koa/router'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Clock } from '../../../tools/Clock'
import { getTargetDataPoints } from './getTargetDataPoints'

export function createTvl2StatusRouter(
  { amounts, prices, chains }: Tvl2Config,
  clock: Clock,
) {
  const router = new Router()

  router.get('/status/tvl2', (ctx) => {
    const pricesByType = groupBy(prices, 'type')

    const amountsByType = groupBy(amounts, 'type')
    const amountsByChain = groupBy(amounts, 'chain')
    const amountsByProject = groupBy(amounts, 'project')

    const chainsConfig = chains.filter((c) => c.config)

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
      chains: {
        chains: chainsConfig.length,
        datapoints: getDatapoints(
          chainsConfig.map((c) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sinceTimestamp: c.config!.minBlockTimestamp,
          })),
          clock,
        ),
        byChain: chainsConfig.map((c) => ({
          chain: c.chain,
          datapoints: getDatapoints(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [{ sinceTimestamp: c.config!.minBlockTimestamp }],
            clock,
          ),
        })),
      },
    }
  })

  return router
}

function getDatapoints(entries: { sinceTimestamp: UnixTime }[], clock: Clock) {
  return entries.reduce((sum, a) => (sum += getTargetDataPoints(a, clock)), 0)
}
