import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { LoopringClient } from '../../../../peripherals/loopring/LoopringClient'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { LoopringTxsCountProvider } from './LoopringTxsCountProvider'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(LoopringTxsCountProvider.name, () => {
  describe(LoopringTxsCountProvider.prototype.getTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockLoopringClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
        { timestamp: START.add(2, 'days'), count: 5, number: 3 },
      ])

      const txsCountProvider = new LoopringTxsCountProvider(
        client,
        ProjectId('a'),
      )
      const result = await txsCountProvider.getTxsCount(1, 3)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 3, 3),
      ])
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })
  })
})

function mockLoopringClient(
  blocks: { timestamp: UnixTime; count: number; number: number }[],
) {
  const mockGetBlock = mockFn()
  blocks.forEach(({ timestamp, count, number }) =>
    mockGetBlock.resolvesToOnce({
      transactions: count,
      createdAt: timestamp,
      blockId: number,
    }),
  )

  return mockObject<LoopringClient>({
    getBlock: mockGetBlock,
  })
}
