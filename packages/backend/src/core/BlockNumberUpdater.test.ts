import { Logger, mock } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../peripherals/etherscan/EtherscanClient'
import { BlockNumberUpdater } from './BlockNumberUpdater'
import { Clock } from './Clock'

describe(BlockNumberUpdater.name, () => {
  describe(BlockNumberUpdater.prototype.start.name, () => {
    const TIME_0 = UnixTime.now().toStartOf('hour')
    const TIME_1 = TIME_0.add(1, 'hours')
    const TIME_2 = TIME_0.add(2, 'hours')
    const TIME_3 = TIME_0.add(3, 'hours')

    it('skips known timestamps', async () => {
      const etherscan = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: mockFn()
          .resolvesToOnce(1300n)
          .resolvesToOnce(1100n),
      })
      const blockNumberRepository = mock<BlockNumberRepository>({
        getAll: mockFn().returns([
          { timestamp: TIME_0, blockNumber: 1000n },
          { timestamp: TIME_2, blockNumber: 1200n },
        ]),
        add: mockFn().returns([]),
      })
      const clock = mock<Clock>({
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
      )

      await blockNumberUpdater.start()

      await waitForExpect(() => {
        expect(etherscan.getBlockNumberAtOrBefore).toHaveBeenCalledExactlyWith([
          [TIME_3],
          [TIME_1],
        ])
      })
    })
  })

  describe(BlockNumberUpdater.prototype.getBlockNumberWhenReady.name, () => {
    it('returns immediately if the data is available', async () => {
      const timestamp = UnixTime.now()
      const etherscanClient = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: async () => 1234,
      })
      const blockNumberRepository = mock<BlockNumberRepository>({
        add: async () => 0,
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscanClient,
        blockNumberRepository,
        mock<Clock>(),
        Logger.SILENT,
      )

      await blockNumberUpdater.update(timestamp)
      const result = await blockNumberUpdater.getBlockNumberWhenReady(timestamp)
      expect(result).toEqual(1234)
    })

    it('waits until data is available, then returns', async () => {
      const timestamp = UnixTime.now()
      const etherscanClient = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: async () => 1234,
      })
      const blockNumberRepository = mock<BlockNumberRepository>({
        add: async () => 0,
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscanClient,
        blockNumberRepository,
        mock<Clock>(),
        Logger.SILENT,
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

  describe(BlockNumberUpdater.prototype.getBlockRangeWhenReady.name, () => {
    it('returns data immediately when available', async () => {
      const from = UnixTime.now()
      const to = from.add(2, 'hours')

      const etherscanClient = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: async () => 1234,
      })
      const blockNumberRepository = mock<BlockNumberRepository>({
        add: async () => 0,
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscanClient,
        blockNumberRepository,
        mock<Clock>(),
        Logger.SILENT,
      )

      await blockNumberUpdater.update(from)
      await blockNumberUpdater.update(from.add(1, 'hours'))
      await blockNumberUpdater.update(from.add(2, 'hours'))

      const result = await blockNumberUpdater.getBlockRangeWhenReady(from, to)

      expect(result).toEqual([
        {
          timestamp: from,
          blockNumber: 1234,
        },
        {
          timestamp: from.add(1, 'hours'),
          blockNumber: 1234,
        },
        {
          timestamp: from.add(2, 'hours'),
          blockNumber: 1234,
        },
      ])
    })

    it('waits until data is available, then returns', async () => {
      const from = UnixTime.now()
      const to = from.add(2, 'hours')

      const etherscanClient = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: async () => 1234,
      })
      const blockNumberRepository = mock<BlockNumberRepository>({
        add: async () => 0,
      })
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscanClient,
        blockNumberRepository,
        mock<Clock>(),
        Logger.SILENT,
      )
      await blockNumberUpdater.update(from)
      await blockNumberUpdater.update(from.add(1, 'hours'))

      let result: unknown = undefined
      void blockNumberUpdater
        .getBlockRangeWhenReady(from, to, 10)
        .then((value) => {
          result = value
        })

      await setTimeout(20)
      expect(result).toEqual(undefined)

      await blockNumberUpdater.update(from.add(2, 'hours'))

      await waitForExpect(() => {
        expect(result).toEqual([
          {
            timestamp: from,
            blockNumber: 1234,
          },
          {
            timestamp: from.add(1, 'hours'),
            blockNumber: 1234,
          },
          {
            timestamp: from.add(2, 'hours'),
            blockNumber: 1234,
          },
        ])
      })
    })
  })
})
