import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { StarkexClient } from '../../../../peripherals/starkex/StarkexClient'
import { StarkexActivityTransactionConfig } from '../../../activity/ActivityTransactionConfig'
import { activityRecord } from '../BaseTxsCountProvider.test'
import { StarkexTxsCountProvider } from './StarkexTxsCountProvider'

describe(StarkexTxsCountProvider.prototype.getTxsCount.name, () => {
  it('should return txs count', async () => {
    const client = mockStarkexClient([2, 3, 4, 5])

    const txsCountProvider = new StarkexTxsCountProvider(
      Logger.SILENT,
      ProjectId('a'),
      client,
      mockObject<StarkexActivityTransactionConfig>({
        type: 'starkex',
        product: ['a', 'b'],
      }),
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
        start.toNumber(),
        start.add(1, 'days').add(-1, 'seconds').toNumber(),
      ),
      activityRecord(
        'a',
        end,
        9,
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
