import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'
import { ActivityConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { AztecClient } from '../../../peripherals/aztec/AztecClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../../peripherals/starkex/StarkexClient'
import {
  RpcActivityTransactionConfig,
  SimpleActivityTransactionConfig,
  StarkexActivityTransactionConfig,
} from '../../activity/ActivityTransactionConfig'
import { TxsCountProvider } from './TxsCountProvider'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(TxsCountProvider.name, () => {
  describe(TxsCountProvider.prototype.getTxsCount.name, () => {
    it('should get txs count for RPC', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<RpcActivityTransactionConfig>({
          type: 'rpc',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getRpcTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })

    it('should get txs count for Starkex', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<StarkexActivityTransactionConfig>({
          type: 'starkex',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getStarkexTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)

      expect(result).toEqual(expected)
    })

    it('should get txs count for Aztec', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<SimpleActivityTransactionConfig<'aztec'>>({
          type: 'aztec',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getAztecTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })
  })

  describe(TxsCountProvider.prototype.getRpcTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockRpcClient([
        count(START, 1),
        count(START.add(1, 'hours'), 2),
        count(START.add(2, 'days'), 5),
      ])

      const peripherals = mockPeripherals({
        rpc: {
          client,
          options: {
            url: 'url',
            callsPerMinute: 1,
          },
        },
      })

      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals,
        projectId: ProjectId('a'),
        projectConfig: {
          type: 'rpc',
          url: 'url',
          callsPerMinute: 1,
        },
        activityConfig: mockObject<ActivityConfig>(),
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
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })

    it('should return txs count and use assessCount', async () => {
      const client = mockRpcClient([
        count(START, 1),
        count(START.add(1, 'hours'), 2),
      ])

      const peripherals = mockPeripherals({
        rpc: {
          client,
          options: {
            url: 'url',
            callsPerMinute: 1,
          },
        },
      })

      const assessCount = mockFn((count) => count - 1)

      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals,
        projectId: ProjectId('a'),
        projectConfig: {
          type: 'rpc',
          url: 'url',
          callsPerMinute: 1,
          assessCount,
        },
        activityConfig: mockObject<ActivityConfig>(),
      })
      const result = await txsCountProvider.getRpcTxsCount(0, 1)

      expect(result).toEqual([activityRecord('a', START.toStartOf('day'), 1)])
      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, RpcClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(assessCount).toHaveBeenCalledTimes(2)
      expect(client.getBlock).toHaveBeenCalledTimes(2)
    })
  })

  describe(TxsCountProvider.prototype.getStarkexTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockStarkexClient([2, 3, 4, 5])
      const options = { apiKey: 'key', callsPerMinute: 1, timeout: undefined }

      const peripherals = mockPeripherals({
        starkex: { client, options },
      })

      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals,
        projectId: ProjectId('a'),
        projectConfig: mockObject<StarkexActivityTransactionConfig>({
          type: 'starkex',
          product: ['a', 'b'],
        }),
        activityConfig: mockObject<ActivityConfig>({
          starkexApiKey: 'key',
          starkexCallsPerMinute: 1,
        }),
      })

      const result = await txsCountProvider.getStarkexTxsCount(0, 1)

      expect(result).toEqual([
        activityRecord('a', UnixTime.fromDays(0), 5),
        activityRecord('a', UnixTime.fromDays(1), 9),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(
        1,
        StarkexClient,
        options,
      )

      expect(client.getDailyCount).toHaveBeenCalledTimes(4)
    })
  })

  describe(TxsCountProvider.prototype.getAztecTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockAztecClient([
        count(START, 1),
        count(START.add(1, 'hours'), 2),
        count(START.add(2, 'days'), 5),
      ])

      const peripherals = mockPeripherals({
        aztec: {
          client,
          options: {
            url: 'url',
            callsPerMinute: 1,
          },
        },
      })

      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals,
        projectId: ProjectId('a'),
        projectConfig: {
          type: 'aztec',
          url: 'url',
          callsPerMinute: 1,
        },
        activityConfig: mockObject<ActivityConfig>(),
      })
      const result = await txsCountProvider.getAztecTxsCount(0, 2)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, AztecClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })
  })
  describe(TxsCountProvider.prototype.sumCountsPerDay.name, () => {
    it('should sum counts per day', () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<RpcActivityTransactionConfig>({
          type: 'rpc',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const counts = [
        activityRecord('a', START, 1),
        activityRecord('a', START.add(2, 'hours'), 2),
        activityRecord('a', START.add(1, 'days'), 3),
        activityRecord('a', START.add(1, 'days').add(5, 'hours'), 4),
      ]

      const result = txsCountProvider.sumCountsPerDay(counts)

      expect(result).toEqual([
        activityRecord('a', START, 3),
        activityRecord('a', START.add(1, 'days'), 7),
      ])
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
  rpc,
  starkex,
  aztec,
}: {
  rpc?: { client: RpcClient; options: any }
  starkex?: { client: StarkexClient; options: any }
  aztec?: { client: AztecClient; options: any }
}) {
  return mockObject<Peripherals>({
    getClient: mockFn()
      .given(RpcClient, rpc?.options)
      .returnsOnce(rpc?.client)
      .given(StarkexClient, starkex?.options)
      .returnsOnce(starkex?.client)
      .given(AztecClient, aztec?.options)
      .returnsOnce(aztec?.client),
  })
}

function mockAztecClient(
  transactionsAndTimestamps: { count: number; timestamp: number }[],
) {
  const mockGetBlock = mockFn()
  transactionsAndTimestamps.forEach(({ timestamp, count }) =>
    mockGetBlock.resolvesToOnce({
      transactionCount: count,
      timestamp: new UnixTime(timestamp),
    }),
  )

  return mockObject<AztecClient>({
    getBlock: mockGetBlock,
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

function mockStarkexClient(counts: number[]) {
  const mockGetDailyCount = mockFn()
  counts.forEach((count) => mockGetDailyCount.resolvesToOnce(count))

  return mockObject<StarkexClient>({
    getDailyCount: mockGetDailyCount,
  })
}

function transactions(count: number) {
  return range(count).map((i) => `0x${i.toString()}`)
}

function count(timestamp: UnixTime, count: number) {
  return { timestamp: timestamp.toNumber(), count }
}
