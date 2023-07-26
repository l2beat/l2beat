import { EtherscanClient, Logger } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { BlockNumberUpdater } from './BlockNumberUpdater'
import { Clock } from './Clock'

describe(BlockNumberUpdater.name, () => {
  describe(BlockNumberUpdater.prototype.start.name, () => {
    const TIME_0 = UnixTime.now().toStartOf('hour')
    const TIME_1 = TIME_0.add(1, 'hours')
    const TIME_2 = TIME_0.add(2, 'hours')
    const TIME_3 = TIME_0.add(3, 'hours')

    it('skips known timestamps', async () => {
      const etherscan = mockObject<EtherscanClient>({
        getChainId: mockFn().returns(ChainId.ETHEREUM),
        getBlockNumberAtOrBefore: mockFn()
          .resolvesToOnce(1300n)
          .resolvesToOnce(1100n),
      })
      const blockNumberRepository = mockObject<BlockNumberRepository>({
        getAll: mockFn().returns([
          { timestamp: TIME_0, blockNumber: 1000n },
          { timestamp: TIME_2, blockNumber: 1200n },
        ]),
        add: mockFn().returns([]),
      })
      const clock = mockObject<Clock>({
        onEveryHour: (callback) => {
          callback(TIME_0)
          callback(TIME_1)
          callback(TIME_2)
          callback(TIME_3)
          return () => {}
        },
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscan,
        blockNumberRepository,
        clock,
        Logger.SILENT,
        ChainId.ETHEREUM,
        new UnixTime(0),
      )

      await blockNumberUpdater.start()

      await waitForExpect(() => {
        expect(etherscan.getBlockNumberAtOrBefore).toHaveBeenCalledTimes(2)
        expect(etherscan.getBlockNumberAtOrBefore).toHaveBeenNthCalledWith(
          1,
          TIME_3,
        )
        expect(etherscan.getBlockNumberAtOrBefore).toHaveBeenNthCalledWith(
          2,
          TIME_1,
        )
      })
    })
  })

  describe(BlockNumberUpdater.prototype.update.name, () => {
    it('throws if timestamp is smaller than minTimestamp', async () => {
      const provider = mockObject<EtherscanClient>({
        getBlockNumberAtOrBefore: mockFn().resolvesToOnce(1n),
        getChainId: mockFn().returns(ChainId.ETHEREUM),
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        provider,
        mockObject<BlockNumberRepository>(),
        mockObject<Clock>(),
        Logger.SILENT,
        ChainId.ETHEREUM,
        new UnixTime(1000),
      )

      await expect(
        async () => await blockNumberUpdater.update(new UnixTime(999)),
      ).toBeRejectedWith('Timestamp cannot be smaller than minTimestamp')
    })
  })

  describe(BlockNumberUpdater.prototype.getBlockNumberWhenReady.name, () => {
    it('returns immediately if the data is available', async () => {
      const timestamp = UnixTime.now()
      const etherscanClient = mockObject<EtherscanClient>({
        getChainId: mockFn().returns(ChainId.ETHEREUM),
        getBlockNumberAtOrBefore: async () => 1234,
      })
      const blockNumberRepository = mockObject<BlockNumberRepository>({
        add: async () => '0',
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscanClient,
        blockNumberRepository,
        mockObject<Clock>(),
        Logger.SILENT,
        ChainId.ETHEREUM,
        new UnixTime(0),
      )

      await blockNumberUpdater.update(timestamp)
      const result = await blockNumberUpdater.getBlockNumberWhenReady(timestamp)
      expect(result).toEqual(1234)
    })

    it('waits until data is available, then returns', async () => {
      const timestamp = UnixTime.now()
      const etherscanClient = mockObject<EtherscanClient>({
        getChainId: mockFn().returns(ChainId.ETHEREUM),
        getBlockNumberAtOrBefore: async () => 1234,
      })
      const blockNumberRepository = mockObject<BlockNumberRepository>({
        add: async () => '0',
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscanClient,
        blockNumberRepository,
        mockObject<Clock>(),
        Logger.SILENT,
        ChainId.ETHEREUM,
        new UnixTime(0),
      )

      let result: unknown = undefined
      void blockNumberUpdater
        .getBlockNumberWhenReady(timestamp, 10)
        .then((value) => {
          result = value
        })

      await setTimeout(20)
      expect(result).toEqual(undefined)

      await blockNumberUpdater.update(timestamp)

      await waitForExpect(() => {
        expect(result).toEqual(1234)
      })
    })
  })

  it('fails construction when chainId mismatch', async () => {
    const etherscan = mockObject<EtherscanClient>({
      getChainId: mockFn().returns(ChainId.ARBITRUM),
    })
    const blockNumberRepository = mockObject<BlockNumberRepository>({})
    const clock = mockObject<Clock>({})

    await expect(
      async () =>
        new BlockNumberUpdater(
          etherscan,
          blockNumberRepository,
          clock,
          Logger.SILENT,
          ChainId.ETHEREUM,
          new UnixTime(0),
        ),
    ).toBeRejectedWith('chainId mismatch')
  })
})
