import { FuelClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { FuelTxsCountService } from './FuelTxsCountService'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(FuelTxsCountService.name, () => {
  describe(FuelTxsCountService.prototype.getTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockFuelClient([
        { timestamp: START.toNumber(), count: 1, number: 1 },
        { timestamp: START.add(1, 'hours').toNumber(), count: 2, number: 2 },
        { timestamp: START.add(2, 'days').toNumber(), count: 5, number: 3 },
      ])

      const txsCountProvider = new FuelTxsCountService(client, ProjectId('a'))

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
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })
  })
})

function mockFuelClient(
  blocks: { timestamp: number; count: number; number: number }[],
) {
  const mockGetBlock = mockFn()
  blocks.forEach(({ timestamp, count, number }) =>
    mockGetBlock.resolvesToOnce({
      transactionsCount: count,
      timestamp,
      height: number,
    }),
  )

  return mockObject<FuelClient>({
    getBlock: mockGetBlock,
  })
}
