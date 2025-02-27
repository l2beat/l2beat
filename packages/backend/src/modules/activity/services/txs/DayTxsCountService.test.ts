import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DayProvider } from '../../../../providers/DayProviders'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { DayTxsCountService } from './DayTxsCountService'

describe(DayTxsCountService.prototype.getTxsCount.name, () => {
  it('should return txs count', async () => {
    const provider = mockProvider([2000, 3000])

    const txsCountProvider = new DayTxsCountService(provider, ProjectId('a'))

    const start = UnixTime.fromDays(5)
    const end = UnixTime.fromDays(6)

    const result = await txsCountProvider.getTxsCount(
      start.toDays(),
      end.toDays(),
    )

    expect(result).toEqual([
      activityRecord(
        'a',
        start,
        2000,
        null,
        start.toNumber(),
        start.add(1, 'days').add(-1, 'seconds').toNumber(),
      ),
      activityRecord(
        'a',
        end,
        3000,
        null,
        end.toNumber(),
        end.add(1, 'days').add(-1, 'seconds').toNumber(),
      ),
    ])
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
