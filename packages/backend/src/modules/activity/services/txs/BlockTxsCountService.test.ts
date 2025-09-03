import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import range from 'lodash/range'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { RpcUopsAnalyzer } from '../uops/RpcUopsAnalyzer'
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
        { timestamp: START + 1 * UnixTime.HOUR, count: 2, number: 2 },
        { timestamp: START + 2 * UnixTime.DAY, count: 5, number: 3 },
      ])

      const txsCountProvider = new BlockTxsCountService({
        projectId: ProjectId('a'),
        provider: client,
        uopsAnalyzer: analyzer,
        assessCount: (count) => count,
        logger: mockObject<Logger>(),
      })

      const result = await txsCountProvider.getTxsCount(1, 3)
      expect(result).toEqual({
        records: [
          activityRecord('a', UnixTime.toStartOf(START, 'day'), 3, 5, 1, 2),
          activityRecord(
            'a',
            UnixTime.toStartOf(START + 2 * UnixTime.DAY, 'day'),
            5,
            7,
            3,
            3,
          ),
        ],
        latestTimestamp: START + 2 * UnixTime.DAY,
      })
      expect(analyzer.calculateUops).toHaveBeenCalledTimes(3)
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(3)
    })

    it('should return txs and uops count and use assessCount', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const client = mockRpcClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START + 1 * UnixTime.HOUR, count: 2, number: 2 },
      ])
      const assessCount = mockFn((count) => count - 1)

      analyzer.calculateUops = mockFn().returnsOnce(2).returnsOnce(3)
      const txsCountProvider = new BlockTxsCountService({
        projectId: ProjectId('a'),
        provider: client,
        uopsAnalyzer: analyzer,
        assessCount,
        logger: mockObject<Logger>(),
      })
      const result = await txsCountProvider.getTxsCount(1, 2)
      expect(result).toEqual({
        records: [
          activityRecord('a', UnixTime.toStartOf(START, 'day'), 1, 3, 1, 2),
        ],
        latestTimestamp: START + 1 * UnixTime.HOUR,
      })
      expect(assessCount).toHaveBeenCalledTimes(4)
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(2)
    })

    it('should handle negative count', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const client = mockRpcClient([
        { timestamp: START, count: 0, number: 1 },
        { timestamp: START + 1 * UnixTime.HOUR, count: 2, number: 2 },
        { timestamp: START + 2 * UnixTime.HOUR, count: 0, number: 3 },
      ])
      const assessCount = mockFn((count) => count - 1)

      const logger = mockObject<Logger>({
        warn: mockFn(() => {}),
      })

      analyzer.calculateUops = mockFn()
        .returnsOnce(0)
        .returnsOnce(3)
        .returnsOnce(0)
      const txsCountProvider = new BlockTxsCountService({
        projectId: ProjectId('a'),
        provider: client,
        uopsAnalyzer: analyzer,
        assessCount,
        logger,
      })
      const result = await txsCountProvider.getTxsCount(1, 3)
      expect(result).toEqual({
        records: [
          activityRecord('a', UnixTime.toStartOf(START, 'day'), 1, 2, 1, 3),
        ],
        latestTimestamp: START + 2 * UnixTime.HOUR,
      })
      expect(logger.warn).toHaveBeenCalledTimes(4)
      expect(logger.warn).toHaveBeenNthCalledWith(1, 'txsCount is negative', {
        projectId: 'a',
        blockNumber: 1,
        txsCount: -1,
      })
      expect(logger.warn).toHaveBeenNthCalledWith(2, 'uopsCount is negative', {
        projectId: 'a',
        blockNumber: 1,
        uopsCount: -1,
      })
      expect(assessCount).toHaveBeenCalledTimes(6)
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(3)
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
      timestamp: timestamp,
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
