import type { BlockProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { RpcUopsAnalyzer } from '../uops/analyzers/RpcUopsAnalyzer'
import { BlockTxsCountService } from './BlockTxsCountService'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(BlockTxsCountService.name, () => {
  describe(BlockTxsCountService.prototype.getTxsCount.name, () => {
    it('should return txs and uops count', async () => {
      const analyzer = mockObject<RpcUopsAnalyzer>({
        calculateUops: mockFn().returnsOnce(2).returnsOnce(3).returnsOnce(7),
      })

      const client = mockRpcClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
        { timestamp: START.add(2, 'days'), count: 5, number: 3 },
      ])

      const txsCountProvider = new BlockTxsCountService({
        projectId: ProjectId('a'),
        provider: client,
        uopsAnalyzer: analyzer,
        assessCount: (count) => count,
      })

      const result = await txsCountProvider.getTxsCount(1, 3)
      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 5, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 7, 3, 3),
      ])
      expect(analyzer.calculateUops).toHaveBeenCalledTimes(3)
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(3)
    })

    it('should return txs and uops count and use assessCount', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const client = mockRpcClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
      ])
      const assessCount = mockFn((count) => count - 1)

      analyzer.calculateUops = mockFn().returnsOnce(2).returnsOnce(3)
      const txsCountProvider = new BlockTxsCountService({
        projectId: ProjectId('a'),
        provider: client,
        uopsAnalyzer: analyzer,
        assessCount,
      })
      const result = await txsCountProvider.getTxsCount(1, 2)
      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 1, 3, 1, 2),
      ])
      expect(assessCount).toHaveBeenCalledTimes(4)
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(2)
    })
  })
})

function mockRpcClient(
  blocks: { timestamp: UnixTime; count: number; number: number }[],
) {
  const mockGetBlock = mockFn()
  blocks.forEach(({ timestamp, count, number }) =>
    mockGetBlock.resolvesToOnce({
      transactions: transactions(count),
      timestamp: timestamp.toNumber(),
      number,
    }),
  )

  return mockObject<BlockProvider>({
    getBlockWithTransactions: mockGetBlock,
  })
}

function transactions(count: number) {
  return range(count).map((i) => ({
    to: `0x${i.toString()}`,
    data: `0x${i.toString()}`,
  }))
}
