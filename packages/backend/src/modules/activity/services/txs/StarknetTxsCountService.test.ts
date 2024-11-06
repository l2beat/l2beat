import { ProjectId, Transaction, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'
import { StarknetClient } from '../../../../peripherals/starknet/StarknetClient'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { StarknetUopsAnalyzer } from '../uops/analyzers/StarknetUopsAnalyzer'
import { StarknetTxsCountService } from './StarknetTxsCountService'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(StarknetTxsCountService.name, () => {
  describe(StarknetTxsCountService.prototype.getTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockStarknetClient([
        { timestamp: START, count: 1, uopsCount: 1, number: 3000 },
        {
          timestamp: START.add(1, 'hours'),
          count: 2,
          uopsCount: 4,
          number: 3001,
        },
        {
          timestamp: START.add(2, 'days'),
          count: 5,
          uopsCount: 12,
          number: 3002,
        },
      ])

      const txsCountProvider = new StarknetTxsCountService(
        client,
        ProjectId('a'),
        new StarknetUopsAnalyzer(),
      )
      const result = await txsCountProvider.getTxsCount(3000, 3002)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 5, 3000, 3001),
        activityRecord(
          'a',
          START.add(2, 'days').toStartOf('day'),
          5,
          12,
          3002,
          3002,
        ),
      ])
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(3)
    })
  })
})

function mockStarknetClient(
  blocks: {
    timestamp: UnixTime
    count: number
    uopsCount: number
    number: number
  }[],
) {
  const mockGetBlock = mockFn()
  blocks.forEach(({ timestamp, count, uopsCount, number }) =>
    mockGetBlock.resolvesToOnce({
      transactions: createTransaction(count, uopsCount),
      timestamp: timestamp.toNumber(),
      number,
    }),
  )

  return mockObject<StarknetClient>({
    getBlockWithTransactions: mockGetBlock,
  })
}

function createTransaction(count: number, uopsCount: number): Transaction[] {
  const uopsPerTx = Math.floor(uopsCount / count)
  const remainingUops = uopsCount % count
  return range(count).map((i) => ({
    data: ['0x' + (i < remainingUops ? uopsPerTx + 1 : uopsPerTx).toString(16)],
    type: 'INVOKE',
    hash: '0x0',
  }))
}
