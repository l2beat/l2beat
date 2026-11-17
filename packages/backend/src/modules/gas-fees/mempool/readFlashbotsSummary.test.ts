import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import {
  parseLandedCount,
  readFlashbotsLandedCount,
} from './readFlashbotsSummary'

describe(readFlashbotsLandedCount.name, () => {
  const day = UnixTime.fromDate(new Date('2025-12-02T00:00:00Z'))

  it("reads the day's summary file", async () => {
    const fetchText = mockFn().resolvesTo({
      status: 200,
      text: '- Transactions: 1,125,000\n- Included on-chain:    818,146 (72.9%)\n',
    })

    expect(await readFlashbotsLandedCount(fetchText, day)).toEqual(818_146)
    expect(fetchText).toHaveBeenOnlyCalledWith(
      'https://mempool-dumpster.flashbots.net/ethereum/mainnet/2025-12/2025-12-02_summary.txt',
    )
  })

  it('returns undefined when the day has no summary', async () => {
    const fetchText = mockFn().resolvesTo({ status: 404, text: '' })

    expect(await readFlashbotsLandedCount(fetchText, day)).toEqual(undefined)
  })

  it('fails on a summary without the count', () => {
    expect(() => parseLandedCount('- Transactions: 1')).toThrow(
      'Flashbots summary malformed',
    )
  })
})
