import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DayProvider } from '../../../../providers/DayProviders'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { DayTxsCountService } from './DayTxsCountService'

describe(DayTxsCountService.prototype.getTxsCount.name, () => {
  it('should return txs count', async () => {
    const provider = mockProvider([2000, 3000])

    const txsCountProvider = new DayTxsCountService(provider, ProjectId('a'))

    const start = 5 * UnixTime.DAY
    const end = 6 * UnixTime.DAY

    const result = await txsCountProvider.getTxsCount(
      UnixTime.toDays(start),
      UnixTime.toDays(end),
    )

    expect(result).toEqual({
      records: [
        activityRecord(
          'a',
          start,
          2000,
          null,
          start,
          start + 1 * UnixTime.DAY - 1,
        ),
        activityRecord('a', end, 3000, null, end, end + 1 * UnixTime.DAY - 1),
      ],
      latestTimestamp: end,
    })
    expect(provider.getDailyCount).toHaveBeenCalledTimes(2)
  })
})

function mockProvider(counts: number[]) {
  const mockGetDailyCount = mockFn()
  counts.forEach((count) => mockGetDailyCount.resolvesToOnce(count))

  return mockObject<DayProvider>({
    getDailyCount: mockGetDailyCount,
  })
}
