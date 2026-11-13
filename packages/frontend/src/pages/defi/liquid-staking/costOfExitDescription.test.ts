import type { ProjectLiquidStaking } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getCostOfExitDescription } from './costOfExitDescription'

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
      "How many days of staking yield a holder gives up to exit about 100 ETH, by the cheapest route: the protocol's withdrawal queue, which earns nothing while it waits; or selling on the best onchain pool, for its discount. ~ marks an estimate: requests still queued are timed at the last 7 days' pace.",
    )
    expect(chart).not.toInclude('instant', 'wBETH')
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
