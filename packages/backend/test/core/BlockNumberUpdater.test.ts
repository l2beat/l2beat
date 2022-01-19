import { expect } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { BlockNumberUpdater } from '../../src/core/BlockNumberUpdater'
import { SafeBlock, SafeBlockService } from '../../src/core/SafeBlockService'
import { UnixTime } from '../../src/model'
import {
  BlockNumberRecord,
  BlockNumberRepository,
} from '../../src/peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../../src/peripherals/etherscan'
import { Logger } from '../../src/tools/Logger'
import { mock } from '../mock'

describe(BlockNumberUpdater.name, () => {
  it('requires minTimestamp to be hour aligned', () => {
    const time = UnixTime.now().toStartOf('hour').add(1, 'seconds')
    expect(
      () =>
        new BlockNumberUpdater(
          time,
          mock<SafeBlockService>(),
          mock<EtherscanClient>(),
          mock<BlockNumberRepository>(),
          Logger.SILENT
        )
    ).toThrow(Error, 'minTimestamp must be aligned to full hours')
  })

  it('only considers blocks after minTimestamp', async () => {
    const minTimestamp = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
    const safeBlockService = mock<SafeBlockService>({
      getSafeBlock() {
        return {
          blockNumber: 610n,
          timestamp: minTimestamp.add(2, 'hours').add(5, 'minutes'),
        }
      },
      onNewSafeBlock: () => () => {},
    })
    const blockNumberRepository = mock<BlockNumberRepository>({
      async getAll() {
        return [
          { blockNumber: 300n, timestamp: minTimestamp.add(-1, 'hours') },
          { blockNumber: 400n, timestamp: minTimestamp },
          { blockNumber: 500n, timestamp: minTimestamp.add(1, 'hours') },
          { blockNumber: 600n, timestamp: minTimestamp.add(2, 'hours') },
        ]
      },
    })

    const blockNumberUpdater = new BlockNumberUpdater(
      minTimestamp,
      safeBlockService,
      mock<EtherscanClient>(),
      blockNumberRepository,
      Logger.SILENT
    )

    await blockNumberUpdater.start()
    const blocks = blockNumberUpdater.getBlockList()
    expect(blocks).toEqual([
      { blockNumber: 400n, timestamp: minTimestamp },
      { blockNumber: 500n, timestamp: minTimestamp.add(1, 'hours') },
      { blockNumber: 600n, timestamp: minTimestamp.add(2, 'hours') },
    ])
  })

  it('can fetch all unknown blocks', async () => {
    const minTimestamp = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
    const safeBlockService = mock<SafeBlockService>({
      getSafeBlock() {
        return {
          blockNumber: 610n,
          timestamp: minTimestamp.add(2, 'hours').add(5, 'minutes'),
        }
      },
      onNewSafeBlock: () => () => {},
    })
    const etherscanClient = mock<EtherscanClient>({
      async getBlockNumberAtOrBefore(timestamp) {
        if (timestamp.equals(minTimestamp)) {
          return 400n
        } else if (timestamp.equals(minTimestamp.add(1, 'hours'))) {
          return 500n
        } else if (timestamp.equals(minTimestamp.add(2, 'hours'))) {
          return 600n
        }
        return -1n
      },
    })
    const blockNumberRepository = mock<BlockNumberRepository>({
      async getAll() {
        return []
      },
      async add() {},
    })

    const blockNumberUpdater = new BlockNumberUpdater(
      minTimestamp,
      safeBlockService,
      etherscanClient,
      blockNumberRepository,
      Logger.SILENT
    )

    await blockNumberUpdater.start()

    await waitForExpect(() => {
      expect(blockNumberUpdater.getBlockList().length).toEqual(3)
    })

    const blocks = blockNumberUpdater.getBlockList()
    expect(blocks).toEqual([
      { blockNumber: 400n, timestamp: minTimestamp },
      { blockNumber: 500n, timestamp: minTimestamp.add(1, 'hours') },
      { blockNumber: 600n, timestamp: minTimestamp.add(2, 'hours') },
    ])
  })

  it('emits events when new blocks are fetched', async () => {
    const minTimestamp = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
    const events: BlockNumberRecord[][] = []
    const safeBlockService = mock<SafeBlockService>({
      getSafeBlock() {
        return {
          blockNumber: 610n,
          timestamp: minTimestamp.add(2, 'hours').add(5, 'minutes'),
        }
      },
      onNewSafeBlock: () => () => {},
    })
    const etherscanClient = mock<EtherscanClient>({
      async getBlockNumberAtOrBefore(timestamp) {
        if (timestamp.equals(minTimestamp)) {
          return 400n
        } else if (timestamp.equals(minTimestamp.add(1, 'hours'))) {
          return 500n
        } else if (timestamp.equals(minTimestamp.add(2, 'hours'))) {
          return 600n
        }
        return -1n
      },
    })
    const blockNumberRepository = mock<BlockNumberRepository>({
      async getAll() {
        return []
      },
      async add() {},
    })

    const blockNumberUpdater = new BlockNumberUpdater(
      minTimestamp,
      safeBlockService,
      etherscanClient,
      blockNumberRepository,
      Logger.SILENT
    )

    await blockNumberUpdater.start()
    blockNumberUpdater.onNewBlocks((event) => events.push(event))

    await waitForExpect(() => {
      expect(blockNumberUpdater.getBlockList().length).toEqual(3)
    })

    expect(events).toEqual([
      [{ blockNumber: 400n, timestamp: minTimestamp }],
      [{ blockNumber: 500n, timestamp: minTimestamp.add(1, 'hours') }],
      [{ blockNumber: 600n, timestamp: minTimestamp.add(2, 'hours') }],
    ])
  })

  it('can fetch new blocks after safe block updates', async () => {
    const minTimestamp = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
    let callback: ((safeBlock: SafeBlock) => void) | undefined
    const safeBlockService = mock<SafeBlockService>({
      getSafeBlock() {
        return {
          blockNumber: 410n,
          timestamp: minTimestamp.add(5, 'minutes'),
        }
      },
      onNewSafeBlock: (cb) => {
        callback = cb
        return () => {}
      },
    })
    const etherscanClient = mock<EtherscanClient>({
      async getBlockNumberAtOrBefore(timestamp) {
        if (timestamp.equals(minTimestamp.add(1, 'hours'))) {
          return 500n
        }
        return -1n
      },
    })
    const blockNumberRepository = mock<BlockNumberRepository>({
      async getAll() {
        return [{ blockNumber: 400n, timestamp: minTimestamp }]
      },
      async add() {},
    })

    const blockNumberUpdater = new BlockNumberUpdater(
      minTimestamp,
      safeBlockService,
      etherscanClient,
      blockNumberRepository,
      Logger.SILENT
    )

    await blockNumberUpdater.start()

    const earlyBlocks = blockNumberUpdater.getBlockList()
    expect(earlyBlocks).toEqual([
      { blockNumber: 400n, timestamp: minTimestamp },
    ])

    callback?.({
      blockNumber: 510n,
      timestamp: minTimestamp.add(1, 'hours').add(5, 'minutes'),
    })

    await waitForExpect(() => {
      expect(blockNumberUpdater.getBlockList().length).toEqual(2)
    })

    const lateBlocks = blockNumberUpdater.getBlockList()
    expect(lateBlocks).toEqual([
      { blockNumber: 400n, timestamp: minTimestamp },
      { blockNumber: 500n, timestamp: minTimestamp.add(1, 'hours') },
    ])
  })
})
