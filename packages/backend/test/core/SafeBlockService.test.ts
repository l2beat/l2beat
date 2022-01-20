import { Logger, UnixTime } from '@l2beat/common'
import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'earljs'

import { SafeBlock, SafeBlockService } from '../../src/core/SafeBlockService'
import { EthereumClient } from '../../src/peripherals/ethereum/EthereumClient'
import { RpcBlock } from '../../src/peripherals/ethereum/types'
import { mock } from '../mock'

describe(SafeBlockService.name, () => {
  it('can obtain the safe block', async () => {
    const ethereumClient = mock<EthereumClient>({
      async getBlockNumber() {
        return 556n
      },
      async getBlock(blockNumber) {
        expect(blockNumber).toEqual(456n)
        return {
          timestamp: new UnixTime(1234),
        } as RpcBlock
      },
    })
    const service = new SafeBlockService(
      100000,
      100n,
      ethereumClient,
      Logger.SILENT
    )
    const stop = await service.start()
    stop()
    const block = service.getSafeBlock()
    expect(block).toEqual({
      timestamp: new UnixTime(1234),
      blockNumber: 456n,
    })
  })

  it('throws when not started', () => {
    const service = new SafeBlockService(
      100000,
      100n,
      mock<EthereumClient>(),
      Logger.SILENT
    )
    expect(() => service.getSafeBlock()).toThrow(Error, 'Not started')
  })

  it('refreshes the block and emits events', async () => {
    let lastBlock = 556n
    const ethereumClient = mock<EthereumClient>({
      async getBlockNumber() {
        return lastBlock++
      },
      async getBlock(blockNumber) {
        return {
          timestamp: new UnixTime(Number((blockNumber as bigint) * 2n)),
        } as RpcBlock
      },
    })
    const service = new SafeBlockService(
      1000,
      100n,
      ethereumClient,
      Logger.SILENT
    )

    const events: SafeBlock[] = []
    function onEvent(event: SafeBlock) {
      events.push(event)
    }

    const clock = FakeTimers.install()

    service.onNewSafeBlock(onEvent)
    await service.start()

    await clock.tickAsync(3000)
    clock.uninstall()

    expect(events).toEqual([
      {
        blockNumber: 456n,
        timestamp: new UnixTime(912),
      },
      {
        blockNumber: 457n,
        timestamp: new UnixTime(914),
      },
      {
        blockNumber: 458n,
        timestamp: new UnixTime(916),
      },
      {
        blockNumber: 459n,
        timestamp: new UnixTime(918),
      },
    ])
  })
})
