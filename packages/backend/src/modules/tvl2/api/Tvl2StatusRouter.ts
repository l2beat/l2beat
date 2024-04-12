import Router from '@koa/router'
import { UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Clock } from '../../../tools/Clock'
import { getTargetDataPoints } from './getTargetDataPoints'

export function createTvl2StatusRouter(
  { amounts, prices, chains }: Tvl2Config,
  indexers: (ChildIndexer & { indexerId: string })[],
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
        byType: Object.fromEntries(
          Object.entries(pricesByType).map(([type, entries]) => [
            type,
            {
              entries: entries.length,
              datapoints: getDatapoints(entries, clock),
            },
          ]),
        ),
      },
      amounts: {
        entries: amounts.length,
        datapoints: getDatapoints(amounts, clock),
        chains: Object.keys(amountsByChain).length,
        projects: Object.keys(amountsByProject).length,
        byType: Object.fromEntries(
          Object.entries(amountsByType).map(([type, entries]) => [
            type,
            {
              entries: entries.length,
              datapoints: getDatapoints(entries, clock),
            },
          ]),
        ),
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
        byChain: Object.fromEntries(
          chainsConfig
            .sort((a, b) => a.chain.localeCompare(b.chain))
            .map((c) => [
              c.chain,
              getDatapoints(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                [{ sinceTimestamp: c.config!.minBlockTimestamp }],
                clock,
              ),
            ]),
        ),
      },
      indexers: Object.fromEntries(
        indexers.map((i) => [i.indexerId, i.safeHeight]),
      ),
    }
  })

  return router
}

function getDatapoints(entries: { sinceTimestamp: UnixTime }[], clock: Clock) {
  return entries.reduce((sum, a) => (sum += getTargetDataPoints(a, clock)), 0)
}
