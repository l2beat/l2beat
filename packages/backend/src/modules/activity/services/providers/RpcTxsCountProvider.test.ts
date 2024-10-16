import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { activityRecord, transactions } from '../../utils/aggregatePerDay.test'
import { RpcUopsAnalyzer } from '../uops/analyzers/RpcUopsAnalyzer'
import { RpcTxsCountProvider } from './RpcTxsCountProvider'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(RpcTxsCountProvider.name, () => {
  describe(RpcTxsCountProvider.prototype.getTxsCount.name, () => {
    it('should return txs and uops count', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const client = mockRpcClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
        { timestamp: START.add(2, 'days'), count: 5, number: 3 },
      ])
      analyzer.analyzeBlock = mockFn()
        .returnsOnce({
          transactionsLength: 1,
          uopsLength: 2,
        })
        .returnsOnce({
          transactionsLength: 2,
          uopsLength: 3,
        })
        .returnsOnce({
          transactionsLength: 5,
          uopsLength: 7,
        })

      const txsCountProvider = new RpcTxsCountProvider(
        client,
        ProjectId('a'),
        analyzer,
      )
      const result = await txsCountProvider.getTxsCount(1, 3)
      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 5, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 7, 3, 3),
      ])
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(3)
    })

    it('should return txs and uops count and use assessCount', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const client = mockRpcClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
      ])
      const assessCount = mockFn((count) => count - 1)

      analyzer.analyzeBlock = mockFn()
        .returnsOnce({
          transactionsLength: 1,
          uopsLength: 2,
        })
        .returnsOnce({
          transactionsLength: 2,
          uopsLength: 3,
        })
      const txsCountProvider = new RpcTxsCountProvider(
        client,
        ProjectId('a'),
        analyzer,
        assessCount,
      )
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

  return mockObject<RpcClient>({
    getBlockWithTransactions: mockGetBlock,
  })
}
