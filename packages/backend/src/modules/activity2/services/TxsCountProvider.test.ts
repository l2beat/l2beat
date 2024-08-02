import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'
import { ActivityConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { DegateClient } from '../../../peripherals/degate'
import { LoopringClient } from '../../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarkexClient } from '../../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../../../peripherals/zksynclite/ZksyncLiteClient'
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

    it('should get txs count for ZKsync', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<SimpleActivityTransactionConfig<'zksync'>>({
          type: 'zksync',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getZksyncTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })

    it('should get txs count for Starknet', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<SimpleActivityTransactionConfig<'starknet'>>({
          type: 'starknet',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getStarknetTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })

    it('should get txs count for Loopring', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<SimpleActivityTransactionConfig<'loopring'>>({
          type: 'loopring',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getLoopringTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })
    it('should get txs count for Loopring', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<SimpleActivityTransactionConfig<'loopring'>>({
          type: 'loopring',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getLoopringTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })

    it('should get txs count for Degate', async () => {
      const txsCountProvider = new TxsCountProvider({
        logger: Logger.SILENT,
        peripherals: mockPeripherals({}),
        projectId: ProjectId('a'),
        projectConfig: mockObject<SimpleActivityTransactionConfig<'degate'>>({
          type: 'degate',
        }),
        activityConfig: mockObject<ActivityConfig>(),
      })

      const expected = [activityRecord('a', START, 1)]
      txsCountProvider.getDegateTxsCount = mockFn().resolvesTo(expected)

      // if this will return expected, then it means that getRpcTxsCount was called
      const result = await txsCountProvider.getTxsCount(0, 2)
      expect(result).toEqual(expected)
    })
  })

  describe(TxsCountProvider.prototype.getRpcTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockRpcClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
        { timestamp: START.add(2, 'days'), count: 5, number: 3 },
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
      const result = await txsCountProvider.getRpcTxsCount(1, 3)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 3, 3),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, RpcClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })

    it('should return txs count and use assessCount', async () => {
      const client = mockRpcClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
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
      const result = await txsCountProvider.getRpcTxsCount(1, 2)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 1, 1, 2),
      ])
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

      const start = UnixTime.fromDays(5)
      const end = UnixTime.fromDays(6)

      const result = await txsCountProvider.getStarkexTxsCount(
        start.toDays(),
        end.toDays(),
      )

      expect(result).toEqual([
        activityRecord(
          'a',
          start,
          5,
          start.toNumber(),
          start.add(1, 'days').add(-1, 'seconds').toNumber(),
        ),
        activityRecord(
          'a',
          end,
          9,
          end.toNumber(),
          end.add(1, 'days').add(-1, 'seconds').toNumber(),
        ),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(
        1,
        StarkexClient,
        options,
      )

      expect(client.getDailyCount).toHaveBeenCalledTimes(4)
    })
  })

  describe(TxsCountProvider.prototype.getZksyncTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockZksyncClient([
        { timestamp: START, count: 1 },
        { timestamp: START.add(1, 'hours'), count: 2 },
        { timestamp: START.add(2, 'days'), count: 5 },
      ])

      const peripherals = mockPeripherals({
        zksync: {
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
          type: 'zksync',
          url: 'url',
          callsPerMinute: 1,
        },
        activityConfig: mockObject<ActivityConfig>(),
      })
      const result = await txsCountProvider.getZksyncTxsCount(1, 3)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 3, 3),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(
        1,
        ZksyncLiteClient,
        {
          url: 'url',
          callsPerMinute: 1,
        },
      )
      expect(client.getTransactionsInBlock).toHaveBeenCalledTimes(3)
    })
  })

  describe(TxsCountProvider.prototype.getStarknetTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockStarknetClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
        { timestamp: START.add(2, 'days'), count: 5, number: 3 },
      ])

      const peripherals = mockPeripherals({
        starknet: {
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
          type: 'starknet',
          url: 'url',
          callsPerMinute: 1,
        },
        activityConfig: mockObject<ActivityConfig>(),
      })
      const result = await txsCountProvider.getStarknetTxsCount(1, 3)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 3, 3),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, StarknetClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })
  })

  describe(TxsCountProvider.prototype.getLoopringTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockLoopringClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
        { timestamp: START.add(2, 'days'), count: 5, number: 3 },
      ])

      const peripherals = mockPeripherals({
        loopring: {
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
          type: 'loopring',
          url: 'url',
          callsPerMinute: 1,
        },
        activityConfig: mockObject<ActivityConfig>(),
      })
      const result = await txsCountProvider.getLoopringTxsCount(1, 3)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 3, 3),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, LoopringClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })
  })

  describe(TxsCountProvider.prototype.getDegateTxsCount.name, () => {
    it('should return txs count', async () => {
      const client = mockDegateClient([
        { timestamp: START, count: 1, number: 1 },
        { timestamp: START.add(1, 'hours'), count: 2, number: 2 },
        { timestamp: START.add(2, 'days'), count: 5, number: 3 },
      ])

      const peripherals = mockPeripherals({
        degate: {
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
          type: 'degate',
          url: 'url',
          callsPerMinute: 1,
        },
        activityConfig: mockObject<ActivityConfig>(),
      })
      const result = await txsCountProvider.getDegateTxsCount(1, 3)

      expect(result).toEqual([
        activityRecord('a', START.toStartOf('day'), 3, 1, 2),
        activityRecord('a', START.add(2, 'days').toStartOf('day'), 5, 3, 3),
      ])

      expect(peripherals.getClient).toHaveBeenNthCalledWith(1, DegateClient, {
        url: 'url',
        callsPerMinute: 1,
      })
      expect(client.getBlock).toHaveBeenCalledTimes(3)
    })
  })
})

function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  start: number = 0,
  end: number = 10,
) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    start,
    end,
  }
}

function mockPeripherals({
  rpc,
  starkex,
  zksync,
  starknet,
  loopring,
  degate,
}: {
  rpc?: { client: RpcClient; options: any }
  starkex?: { client: StarkexClient; options: any }
  zksync?: { client: ZksyncLiteClient; options: any }
  starknet?: { client: StarknetClient; options: any }
  loopring?: { client: LoopringClient; options: any }
  degate?: { client: DegateClient; options: any }
}) {
  return mockObject<Peripherals>({
    getClient: mockFn()
      .given(RpcClient, rpc?.options)
      .returnsOnce(rpc?.client)
      .given(StarkexClient, starkex?.options)
      .returnsOnce(starkex?.client)
      .given(ZksyncLiteClient, zksync?.options)
      .returnsOnce(zksync?.client)
      .given(StarknetClient, starknet?.options)
      .returnsOnce(starknet?.client)
      .given(LoopringClient, loopring?.options)
      .returnsOnce(loopring?.client)
      .given(DegateClient, degate?.options)
      .returnsOnce(degate?.client),
  })
}

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
    getBlock: mockGetBlock,
  })
}

function mockStarknetClient(
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

  return mockObject<StarknetClient>({
    getBlock: mockGetBlock,
  })
}

function mockDegateClient(
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

  return mockObject<DegateClient>({
    getBlock: mockGetBlock,
  })
}

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
