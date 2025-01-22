import type { StarkexClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { StarkexTxsCountService } from './StarkexTxsCountService'

describe(StarkexTxsCountService.prototype.getTxsCount.name, () => {
  it('should return txs count', async () => {
    const client = mockStarkexClient([2, 3, 4, 5])

    const txsCountProvider = new StarkexTxsCountService(
      client,
      ProjectId('a'),
      ['a', 'b'],
    )

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
        5,
        null,
        start.toNumber(),
        start.add(1, 'days').add(-1, 'seconds').toNumber(),
      ),
      activityRecord(
        'a',
        end,
        9,
        null,
        end.toNumber(),
        end.add(1, 'days').add(-1, 'seconds').toNumber(),
      ),
    ])
    expect(client.getDailyCount).toHaveBeenCalledTimes(4)
  })
})

function mockStarkexClient(counts: number[]) {
  const mockGetDailyCount = mockFn()
  counts.forEach((count) => mockGetDailyCount.resolvesToOnce(count))

  return mockObject<StarkexClient>({
    getDailyCount: mockGetDailyCount,
  })
}
