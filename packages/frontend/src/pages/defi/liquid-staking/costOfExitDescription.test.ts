import type { ProjectLiquidStaking } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  ALL_ROUTES_COST_OF_EXIT,
  getCostOfExitDescription,
} from './costOfExitDescription'

describe(getCostOfExitDescription.name, () => {
  it('names only the queue and selling for Lido', () => {
    const { tooltip, chart } = getCostOfExitDescription({
      contracts: {
        type: 'lido',
        stETH: ADDRESS,
        withdrawalQueue: ADDRESS,
      },
      marketQuotes: [POOL],
    })

    expect(tooltip).toEqual(
      'Days of staking yield it costs to exit 1 ETH, by the cheaper route: waiting in the queue, which earns nothing, or the market discount. ~ marks a value that can still change.',
    )
    expect(chart).toEqual(tooltip)
  })

  it('names every route on the comparison page', () => {
    expect(ALL_ROUTES_COST_OF_EXIT.tooltip).toEqual(
      "Days of staking yield it costs to exit 1 ETH, by the cheapest route: waiting in the queue, which earns nothing, an instant exit's fee, or the market discount. ~ marks a value that can still change.",
    )
    expect(ALL_ROUTES_COST_OF_EXIT.chart).toEqual(
      ALL_ROUTES_COST_OF_EXIT.tooltip,
    )
  })

  it('names one route as the only one, with why selling is not counted', () => {
    const { tooltip, chart } = getCostOfExitDescription({
      contracts: { type: 'wbeth', wBETH: ADDRESS, unwrapToken: ADDRESS },
      marketQuotes: [],
    })

    expect(tooltip).toInclude(
      'by its only route: unwrapping, which earns nothing while it waits.',
    )
    expect(chart).toInclude('Binance', 'Its pools are too thin to quote.')
  })

  it('has no estimate note without a queue', () => {
    const { tooltip } = getCostOfExitDescription({
      contracts: { type: 'cbeth', cbETH: ADDRESS },
      marketQuotes: [POOL],
    })

    expect(tooltip).not.toInclude('~')
  })
})

const ADDRESS = ChainSpecificAddress(
  'eth:0x0000000000000000000000000000000000000001',
)
const POOL: ProjectLiquidStaking['marketQuotes'][number] = {
  type: 'curve',
  pool: ADDRESS,
  i: 1,
  j: 0,
}
