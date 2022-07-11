import { Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { BlockNumberUpdater } from '../../src/core/BlockNumberUpdater'
import { Clock } from '../../src/core/Clock'
import { BlockNumberRepository } from '../../src/peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../../src/peripherals/etherscan/EtherscanClient'

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
        getBlockNumberAtOrBefore: async () => 1234n,
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
      expect(result).toEqual(1234n)
    })

    it('waits until data is available, then returns', async () => {
      const timestamp = UnixTime.now()
      const etherscanClient = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: async () => 1234n,
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
        expect(result).toEqual(1234n)
      })
    })
  })
})
