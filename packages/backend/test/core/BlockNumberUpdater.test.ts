import { Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { BlockNumberUpdater } from '../../src/core/BlockNumberUpdater'
import { BlockNumberRepository } from '../../src/peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../../src/peripherals/etherscan/EtherscanClient'

describe(BlockNumberUpdater.name, () => {
  describe(BlockNumberUpdater.prototype.update.name, () => {
    const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
    const START_BN = 1000n

    it('all known blocks', async () => {
      const etherscan = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: mockFn().returns([]),
      })
      const blockNumberRepository = mock<BlockNumberRepository>({
        getAll: mockFn().returns([
          { timestamp: START, blockNumber: START_BN },
          { timestamp: START.add(1, 'hours'), blockNumber: START_BN + 100n },
          { timestamp: START.add(2, 'hours'), blockNumber: START_BN + 200n },
        ]),
        add: mockFn().returns([]),
      })
      const timestamps = [START, START.add(1, 'hours'), START.add(2, 'hours')]
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscan,
        blockNumberRepository,
        Logger.SILENT,
      )

      const result = await blockNumberUpdater.update(timestamps)

      expect(result).toEqual([START_BN, START_BN + 100n, START_BN + 200n])
      expect(etherscan.getBlockNumberAtOrBefore).toHaveBeenCalledExactlyWith([])
      expect(blockNumberRepository.add).toHaveBeenCalledExactlyWith([])
    })

    it('all unknown blocks', async () => {
      const etherscan = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: mockFn()
          .returnsOnce(START_BN)
          .returnsOnce(START_BN + 100n)
          .returnsOnce(START_BN + 200n),
      })
      const blockNumberRepository = mock<BlockNumberRepository>({
        getAll: mockFn().returns([]),
        add: mockFn().returns([]),
      })
      const timestamps = [START, START.add(1, 'hours'), START.add(2, 'hours')]
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscan,
        blockNumberRepository,
        Logger.SILENT,
      )

      const result = await blockNumberUpdater.update(timestamps)

      expect(result).toEqual([START_BN, START_BN + 100n, START_BN + 200n])
      expect(etherscan.getBlockNumberAtOrBefore).toHaveBeenCalledExactlyWith([
        [START],
        [START.add(1, 'hours')],
        [START.add(2, 'hours')],
      ])
      expect(blockNumberRepository.add).toHaveBeenCalledExactlyWith([
        [{ timestamp: START, blockNumber: START_BN }],
        [{ timestamp: START.add(1, 'hours'), blockNumber: START_BN + 100n }],
        [{ timestamp: START.add(2, 'hours'), blockNumber: START_BN + 200n }],
      ])
    })
    it('mixed: known and unknown blocks', async () => {
      const etherscan = mock<EtherscanClient>({
        getBlockNumberAtOrBefore: mockFn().returnsOnce(START_BN + 200n),
      })

      const blockNumberRepository = mock<BlockNumberRepository>({
        getAll: mockFn().returns([
          { timestamp: START, blockNumber: START_BN },
          { timestamp: START.add(1, 'hours'), blockNumber: START_BN + 100n },
        ]),
        add: mockFn().returns([]),
      })
      const timestamps = [START, START.add(1, 'hours'), START.add(2, 'hours')]
      const blockNumberUpdater = new BlockNumberUpdater(
        etherscan,
        blockNumberRepository,
        Logger.SILENT,
      )

      const result = await blockNumberUpdater.update(timestamps)

      expect(result).toEqual([START_BN, START_BN + 100n, START_BN + 200n])
      expect(etherscan.getBlockNumberAtOrBefore).toHaveBeenCalledExactlyWith([
        [START.add(2, 'hours')],
      ])
      expect(blockNumberRepository.add).toHaveBeenCalledExactlyWith([
        [{ timestamp: START.add(2, 'hours'), blockNumber: START_BN + 200n }],
      ])
    })
  })
})
