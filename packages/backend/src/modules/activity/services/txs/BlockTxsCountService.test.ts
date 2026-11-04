import type { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BlockTxsCountService } from './BlockTxsCountService'
import type { ActivityBlockProvider } from './types'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(BlockTxsCountService.name, () => {
  describe(BlockTxsCountService.prototype.getBlocks.name, () => {
    it('should return txs and uops count', async () => {
      const client = mockRpcClient([
        { timestamp: START, count: 1, uopsCount: 2, number: 1 },
        {
          timestamp: START + 1 * UnixTime.HOUR,
          count: 2,
          uopsCount: 3,
          number: 2,
        },
        {
          timestamp: START + 2 * UnixTime.DAY,
          count: 5,
          uopsCount: 7,
          number: 3,
        },
      ])

      const txsCountProvider = new BlockTxsCountService(
        {
          projectId: ProjectId('a'),
          provider: client,
          assessCount: (count) => count,
        },
        mockObject<Logger>({
          for: mockFn().returns(mockObject<Logger>()),
        }),
      )

      const result = await txsCountProvider.getBlocks(1, 3)
      expect(result).toEqual([
        countedBlock(START, 1, 2, 1),
        countedBlock(START + 1 * UnixTime.HOUR, 2, 3, 2),
        countedBlock(START + 2 * UnixTime.DAY, 5, 7, 3),
      ])
      expect(client.getBlocks).toHaveBeenOnlyCalledWith(1, 3)
    })

    it('should return txs and uops count and use assessCount', async () => {
      const client = mockRpcClient([
        { timestamp: START, count: 1, uopsCount: 2, number: 1 },
        {
          timestamp: START + 1 * UnixTime.HOUR,
          count: 2,
          uopsCount: 3,
          number: 2,
        },
      ])
      const assessCount = mockFn((count) => count - 1)

      const txsCountProvider = new BlockTxsCountService(
        {
          projectId: ProjectId('a'),
          provider: client,
          assessCount,
        },
        mockObject<Logger>({
          for: mockFn().returns(
            mockObject<Logger>({
              warn: mockFn(),
            }),
          ),
        }),
      )
      const result = await txsCountProvider.getBlocks(1, 2)
      expect(result).toEqual([
        countedBlock(START, 0, 1, 1),
        countedBlock(START + 1 * UnixTime.HOUR, 1, 2, 2),
      ])
      expect(assessCount).toHaveBeenCalledTimes(4)
      expect(client.getBlocks).toHaveBeenOnlyCalledWith(1, 2)
    })

    it('should handle negative count', async () => {
      const client = mockRpcClient([
        { timestamp: START, count: 0, uopsCount: 0, number: 1 },
        {
          timestamp: START + 1 * UnixTime.HOUR,
          count: 2,
          uopsCount: 3,
          number: 2,
        },
        {
          timestamp: START + 2 * UnixTime.HOUR,
          count: 0,
          uopsCount: 0,
          number: 3,
        },
      ])
      const assessCount = mockFn((count) => count - 1)

      const forLogger = mockObject<Logger>({
        warn: mockFn().returns(undefined),
      })
      const logger = mockObject<Logger>({
        for: mockFn().returns(forLogger),
      })

      const txsCountProvider = new BlockTxsCountService(
        {
          projectId: ProjectId('a'),
          provider: client,
          assessCount,
        },
        logger,
      )
      const result = await txsCountProvider.getBlocks(1, 3)
      expect(result).toEqual([
        countedBlock(START, 0, 0, 1),
        countedBlock(START + 1 * UnixTime.HOUR, 1, 2, 2),
        countedBlock(START + 2 * UnixTime.HOUR, 0, 0, 3),
      ])
      expect(forLogger.warn).toHaveBeenCalledTimes(4)
      expect(forLogger.warn).toHaveBeenNthCalledWith(
        1,
        'txsCount is negative',
        {
          projectId: 'a',
          blockNumber: 1,
          txsCount: -1,
        },
      )
      expect(forLogger.warn).toHaveBeenNthCalledWith(
        2,
        'uopsCount is negative',
        {
          projectId: 'a',
          blockNumber: 1,
          uopsCount: -1,
        },
      )
      expect(assessCount).toHaveBeenCalledTimes(6)
      expect(client.getBlocks).toHaveBeenOnlyCalledWith(1, 3)
    })
  })
})

function countedBlock(
  timestamp: UnixTime,
  txsCount: number,
  uopsCount: number | null,
  number: number,
) {
  return { timestamp, txsCount, uopsCount, number }
}

function mockRpcClient(
  blocks: {
    timestamp: UnixTime
    count: number
    uopsCount: number | null
    number: number
  }[],
) {
  return mockObject<ActivityBlockProvider>({
    getBlocks: mockFn().resolvesToOnce(
      blocks.map(({ timestamp, count, uopsCount, number }) => ({
        timestamp,
        txsCount: count,
        uopsCount,
        number,
      })),
    ),
    chain: 'ethereum',
  })
}
