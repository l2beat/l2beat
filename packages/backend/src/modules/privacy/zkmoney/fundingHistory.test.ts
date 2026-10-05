import type { LogsProvider } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { fetchFundingHistory } from './fundingHistory'
import { ALICE, DAI, SIPA, transfer } from './test/fixtures'

// The logs mock records every requested block range, so the tests can check
// how a scan is cut into requests without a real RPC.
describe(fetchFundingHistory.name, () => {
  it('cuts a long scan into back-to-back requests of at most 10,000 blocks', async () => {
    const getLogs = mockFn<LogsProvider['getLogs']>().resolvesTo([])
    const logsProvider = mockObject<LogsProvider>({ getLogs })

    await fetchFundingHistory(logsProvider, [SIPA], [DAI], 100, 25_099)

    const ranges = getLogs.calls.map(({ args }) => args.slice(0, 2))
    const queriesPerRange = 3
    expect(ranges).toEqual(
      [
        [100, 10_099],
        [10_100, 20_099],
        [20_100, 25_099],
      ].flatMap((range) => Array(queriesPerRange).fill(range)),
    )
  })

  it('returns the logs of every request', async () => {
    const early = transfer(ALICE, SIPA, 1n, { blockNumber: 100, logIndex: 0 })
    const late = transfer(ALICE, SIPA, 2n, { blockNumber: 10_100, logIndex: 0 })
    const getLogs = mockFn<LogsProvider['getLogs']>()
      .resolvesToOnce([early])
      .resolvesToOnce([])
      .resolvesToOnce([])
      .resolvesToOnce([late])
      .resolvesTo([])
    const logsProvider = mockObject<LogsProvider>({ getLogs })

    const history = await fetchFundingHistory(
      logsProvider,
      [SIPA],
      [DAI],
      100,
      10_100,
    )

    expect(history).toEqual([early, late])
  })
})
