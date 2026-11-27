import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mockDay, utcDay } from '../test/mockDay'
import { toGasFeesStats } from './getGasFeesStats'
import { summarizeChains } from './summarizeChains'

const FROM = utcDay('2026-01-01')
const at = (days: number) => UnixTime(FROM + days * UnixTime.DAY)

describe(summarizeChains.name, () => {
  const days = [
    mockDay('ethereum', { timestamp: at(0), totalFeeUsd: 1_000 }),
    mockDay('ethereum', { timestamp: at(1), totalFeeUsd: 3_000 }),
    mockDay('base', { timestamp: at(1), totalFeeUsd: 30 }),
  ]

  it('counts days without a row up to the newest day stored', () => {
    const chains = summarizeChains(days, FROM)
    expect(chains.find((c) => c.chain === 'base')?.missingDays).toEqual(1)
    expect(chains.find((c) => c.chain === 'ink')).toEqual(
      expect.subset({
        missingDays: 2,
        hasData: false,
        costs: expect.subset({ avgFee: null }),
      }),
    )
  })

  it('compares with Ethereum over the days both have', () => {
    const base = summarizeChains(days, FROM).find((c) => c.chain === 'base')
    expect(base?.costs.avgFee).toEqual(3)
    expect(base?.vsEthereum?.avgFee).toEqual({ chain: 3, ethereum: 300 })
    expect(summarizeChains(days, FROM)[0]?.costs.avgFee).toEqual(200)
  })
})

describe(toGasFeesStats.name, () => {
  const days = [
    mockDay('ethereum', { timestamp: at(0), l1FeeNative: 0 }),
    mockDay('base', { timestamp: at(0), totalFeeUsd: 100 }),
    mockDay('ink', { timestamp: at(0), totalFeeUsd: 300 }),
    mockDay('taiko', {
      timestamp: at(0),
      txCount: 0,
      gasUsed: 0,
      totalFeeNative: 0,
      totalFeeUsd: 0,
    }),
  ]

  it("sets Ethereum's newest cost against the median of the L2s that have one", () => {
    const erc20AtUsdPerEth = (usd: number) => (46_109 * 8e-9 + 0.2) * usd
    expect(toGasFeesStats(days, FROM, at(0)).latestErc20).toEqual({
      day: at(0),
      ethereum: 46_109 * 1e-8 * 2_000,
      l2Median: (erc20AtUsdPerEth(10) + erc20AtUsdPerEth(30)) / 2,
      l2Count: 2,
    })
  })

  it('says since when the stored days are stale', () => {
    expect(toGasFeesStats(days, FROM, at(1)).staleSince).toEqual(undefined)
    expect(toGasFeesStats(days, FROM, at(2)).staleSince).toEqual(at(0))
  })
})
