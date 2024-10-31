import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { ZKsyncLiteTxsCountService } from './ZKsyncLiteTxsCountService'
import { ZksyncLiteClient } from '../../../../peripherals/zksynclite/ZksyncLiteClient'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(ZKsyncLiteTxsCountService.name, () => {
  describe(ZKsyncLiteTxsCountService.prototype.getTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockZksyncClient([
        { timestamp: START, count: 1 },
        { timestamp: START.add(1, 'hours'), count: 2 },
        { timestamp: START.add(2, 'days'), count: 5 },
      ])

      const txsCountProvider = new ZKsyncLiteTxsCountService(
        client,
        ProjectId('a'),
      )
      const result = await txsCountProvider.getTxsCount(1, 3)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, null, 1, 2),
        activityRecord(
          'a',
          START.add(2, 'days').toStartOf('day'),
          5,
          null,
          3,
          3,
        ),
      ])
      expect(client.getTransactionsInBlock).toHaveBeenCalledTimes(3)
    })
  })
})

function mockZksyncClient(blocks: { timestamp: UnixTime; count: number }[]) {
  const mockGetBlock = mockFn()
  blocks.forEach(({ timestamp, count }) =>
    mockGetBlock.resolvesToOnce(
      range(count).map(() => ({
        createdAt: timestamp.add(1, 'seconds'),
      })),
    ),
  )

  return mockObject<ZksyncLiteClient>({
    getTransactionsInBlock: mockGetBlock,
  })
}
