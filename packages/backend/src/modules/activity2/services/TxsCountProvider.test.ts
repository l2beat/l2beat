import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'
import { Peripherals } from '../../../peripherals/Peripherals'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { TxsCountProvider } from './TxsCountProvider'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(TxsCountProvider.name, () => {
  describe(TxsCountProvider.prototype.getTxsCount.name, () => {
    it('should get txs count for RPC', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: {
          type: 'rpc',
          defaultUrl: 'url',
          defaultCallsPerMinute: 1,
        },
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getRpcTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })
  })
  describe(TxsCountProvider.prototype.getRpcTxsCount.name, () => {
    it('should return txs count', async () => {
      const rpcClient = mockRpcClient([
        count(START, 1),
        count(START.add(1, 'hours'), 2),
        count(START.add(2, 'days'), 5),
      ])
      const peripherals = mockPeripherals({
        mockRpcClient: rpcClient,
      })

      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals,
        projectId: ProjectId('a'),
        projectConfig: {
          type: 'rpc',
          defaultUrl: 'url',
          defaultCallsPerMinute: 1,
        },
      })
      const result = await txsCountProvider.getRpcTxsCount(0, 2)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, RpcClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(rpcClient.getBlock).toHaveBeenCalledTimes(3)
    })

    it('should return txs count and use assessCount', async () => {
      const rpcClient = mockRpcClient([
        count(START, 1),
        count(START.add(1, 'hours'), 2),
      ])
      const peripherals = mockPeripherals({
        mockRpcClient: rpcClient,
      })

      const assessCount = mockFn((count) => count - 1)

      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals,
        projectId: ProjectId('a'),
        projectConfig: {
          type: 'rpc',
          defaultUrl: 'url',
          defaultCallsPerMinute: 1,
          assessCount,
        },
      })
      const result = await txsCountProvider.getRpcTxsCount(0, 1)

      expect(result).toEqual([activityRecord('a', START.toStartOf('day'), 1)])
      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, RpcClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(assessCount).toHaveBeenCalledTimes(2)
      expect(rpcClient.getBlock).toHaveBeenCalledTimes(2)
    })
  })
})

function activityRecord(projectId: string, timestamp: UnixTime, count: number) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
  }
}

function mockPeripherals({
  mockRpcClient,
}: {
  mockRpcClient?: RpcClient
}) {
  return mockObject<Peripherals>({
    getClient: mockFn()
      .given(RpcClient, { url: 'url', callsPerMinute: 1 })
      .returnsOnce(mockRpcClient),
  })
}

function mockRpcClient(
  transactionsAndTimestamps: { count: number; timestamp: number }[],
) {
  const mockGetBlock = mockFn()
  transactionsAndTimestamps.forEach(({ timestamp, count }) =>
    mockGetBlock.resolvesToOnce({
      transactions: transactions(count),
      timestamp,
    }),
  )

  return mockObject<RpcClient>({
    getBlock: mockGetBlock,
  })
}

function transactions(count: number) {
  return range(count).map((i) => `0x${i.toString()}`)
}

function count(timestamp: UnixTime, count: number) {
  return { timestamp: timestamp.toNumber(), count }
}
