import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import type { LowLevelProvider } from './LowLevelProvider'
import type { MulticallClient } from './multicall/MulticallClient'
import type { ReorgAwareCache } from './ReorgAwareCache'

describe(BatchingAndCachingProvider.name, () => {
  const logger = Logger.SILENT

  describe(BatchingAndCachingProvider.prototype.getLogs.name, () => {
    it('divides on two calls', async () => {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().returns({
          read: () => undefined,
        }),
        write: mockFn().returns(undefined),
      })
      const provider = mockObject<LowLevelProvider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })
      const multicallClient = mockObject<MulticallClient>()

      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        multicallClient,
        logger,
      )

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await batchingProvider.getLogs(address, [topic], 0, 2000)

      expect(provider.getLogs).toHaveBeenNthCalledWith(
        1,
        address,
        [[topic]],
        0,
        2000,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        2,
        address,
        [[topic]],
        0,
        1000,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        3,
        address,
        [[topic]],
        1001,
        2000,
      )
    })

    it('divides when the RPC times out asking for a smaller range', async () => {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().returns({
          read: () => undefined,
        }),
        write: mockFn().returns(undefined),
      })
      const provider = mockObject<LowLevelProvider>({
        getLogs: mockFn()
          .throwsOnce(
            new Error(
              'bad response (status=400, body="{\\"error\\":{\\"code\\":-32000,\\"message\\":\\"Query timeout exceeded. Consider reducing your block range.\\"}}")',
            ),
          )
          .returnsOnce([])
          .returnsOnce([]),
      })
      const multicallClient = mockObject<MulticallClient>()

      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        multicallClient,
        logger,
      )

      const address = EthereumAddress.random()
      await batchingProvider.getLogs(address, ['aaaa'], 0, 2000)

      expect(provider.getLogs).toHaveBeenCalledTimes(3)
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        2,
        address,
        [['aaaa']],
        0,
        1000,
      )
    })

    it('correctly divides range of two', async () => {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().returns({
          read: () => undefined,
        }),
        write: mockFn().returns(undefined),
      })
      const provider = mockObject<LowLevelProvider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })
      const multicallClient = mockObject<MulticallClient>()

      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        multicallClient,
        logger,
      )

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await batchingProvider.getLogs(address, [topic], 0, 1)

      expect(provider.getLogs).toHaveBeenNthCalledWith(
        1,
        address,
        [[topic]],
        0,
        1,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        2,
        address,
        [[topic]],
        0,
        0,
      )
      expect(provider.getLogs).toHaveBeenNthCalledWith(
        3,
        address,
        [[topic]],
        1,
        1,
      )
    })

    it('fromBlock === toBlock', async () => {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().returns({
          read: () => undefined,
        }),
        write: mockFn().returns(undefined),
      })
      const provider = mockObject<LowLevelProvider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })
      const multicallClient = mockObject<MulticallClient>()

      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        multicallClient,
        logger,
      )

      const address = EthereumAddress.random()
      const topic = 'aaaa'

      await expect(
        batchingProvider.getLogs(address, [topic], 1, 1),
      ).toBeRejected()

      expect(provider.getLogs).toHaveBeenNthCalledWith(
        1,
        address,
        [topic],
        1,
        1,
      )
    })
  })

  describe(BatchingAndCachingProvider.prototype.getHeldTokens.name, () => {
    const TOKEN = EthereumAddress.random()
    const BLOCK = 100

    function setup(
      getHeldTokens: LowLevelProvider['getHeldTokens'],
      cached: Record<string, string> = {},
    ) {
      const written: Record<string, string> = {}
      const cache = mockObject<ReorgAwareCache>({
        entry: async (_invocation, params) => {
          const holder = String(params[1])
          return {
            read: () => cached[holder],
            write: (value: string) => {
              written[holder] = value
            },
          }
        },
      })
      const provider = mockObject<LowLevelProvider>({ getHeldTokens })
      const batchingProvider = new BatchingAndCachingProvider(
        cache,
        provider,
        mockObject<MulticallClient>(),
        logger,
      )
      return { batchingProvider, provider, written }
    }

    function holdEveryToken(holders: EthereumAddress[]) {
      return Promise.resolve(holders.map(() => [TOKEN]))
    }

    // 25 holders per call is what the index can read cold within its time
    // limit, so 60 holders have to go out as 25 + 25 + 10.
    it('asks in calls of 25 holders and answers in the order asked', async () => {
      const holders = Array.from({ length: 60 }, () => EthereumAddress.random())
      const { batchingProvider, provider } = setup(
        mockFn((asked: EthereumAddress[]) =>
          Promise.resolve(asked.map((holder) => [holder])),
        ),
      )

      const held = await batchingProvider.getHeldTokens(holders, [TOKEN], BLOCK)

      expect(held).toEqual(holders.map((holder) => [holder]))
      expect(provider.getHeldTokens).toHaveBeenCalledTimes(3)
      expect(provider.getHeldTokens).toHaveBeenCalledWith(holders.slice(50), [
        TOKEN,
      ])
    })

    it('asks only about holders that are not cached and caches the answers', async () => {
      const cachedHolder = EthereumAddress.random()
      const newHolder = EthereumAddress.random()
      const { batchingProvider, provider, written } = setup(
        mockFn(holdEveryToken),
        { [cachedHolder.toString()]: '[]' },
      )

      const held = await batchingProvider.getHeldTokens(
        [cachedHolder, newHolder],
        [TOKEN],
        BLOCK,
      )

      expect(held).toEqual([[], [TOKEN]])
      expect(provider.getHeldTokens).toHaveBeenOnlyCalledWith(
        [newHolder],
        [TOKEN],
      )
      expect(written).toEqual({
        [newHolder.toString()]: JSON.stringify([TOKEN]),
      })
    })

    // An RPC without the index refuses every call, and each call uploads the
    // whole filter, so one refusal has to end the asking.
    it('answers undefined and stops asking once the RPC refuses', async () => {
      const holders = Array.from({ length: 200 }, () =>
        EthereumAddress.random(),
      )
      const { batchingProvider, provider, written } = setup(
        mockFn().rejectsWith(new Error('method not found')),
      )

      const held = await batchingProvider.getHeldTokens(holders, [TOKEN], BLOCK)

      expect(held).toEqual(holders.map(() => undefined))
      expect(provider.getHeldTokens).toHaveBeenCalledTimes(4)
      expect(written).toEqual({})
    })

    it('knows without asking that no holder holds any of zero tokens', async () => {
      const { batchingProvider, provider } = setup(mockFn(holdEveryToken))

      const held = await batchingProvider.getHeldTokens(
        [EthereumAddress.random()],
        [],
        BLOCK,
      )

      expect(held).toEqual([[]])
      expect(provider.getHeldTokens).not.toHaveBeenCalled()
    })
  })

  describe('batch flush failure', () => {
    function setup() {
      const cache = mockObject<ReorgAwareCache>({
        entry: mockFn().rejectsWith(new Error('cache unavailable')),
      })
      return new BatchingAndCachingProvider(
        cache,
        mockObject<LowLevelProvider>(),
        mockObject<MulticallClient>(),
        logger,
      )
    }

    it('rejects every batched call', async () => {
      const batchingProvider = setup()
      const address = EthereumAddress.random()

      const first = batchingProvider.call(address, Bytes.fromHex('0x01'), 1)
      const second = batchingProvider.call(address, Bytes.fromHex('0x02'), 1)

      await expect(first).toBeRejectedWith('cache unavailable')
      await expect(second).toBeRejectedWith('cache unavailable')
    })

    it('rejects every batched storage read', async () => {
      const batchingProvider = setup()
      const address = EthereumAddress.random()

      const first = batchingProvider.getStorage(address, 0, 1)
      const second = batchingProvider.getStorage(address, 1, 1)

      await expect(first).toBeRejectedWith('cache unavailable')
      await expect(second).toBeRejectedWith('cache unavailable')
    })

    it('rejects every batched log request', async () => {
      const batchingProvider = setup()
      const address = EthereumAddress.random()

      const first = batchingProvider.getLogs(address, ['aaaa'], 0, 1)
      const second = batchingProvider.getLogs(address, ['bbbb'], 0, 1)

      await expect(first).toBeRejectedWith('cache unavailable')
      await expect(second).toBeRejectedWith('cache unavailable')
    })
  })
})
