import { Logger } from '@l2beat/backend-tools'
import type { Block, Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createInteropEventType } from '../../plugins/types'
import { InteropBlockProcessor } from './InteropBlockProcessor'
import type { InteropEventStore } from './InteropEventStore'

describe(InteropBlockProcessor.name, () => {
  describe(InteropBlockProcessor.prototype.processBlock.name, () => {
    it('captures and saves nothing until ready', async () => {
      const event = TestEvent.mock({ value: 1 })
      const capture = mockFn().returns([event])
      const saveNewEvents = mockFn().resolvesTo(undefined)
      const ready = deferred<void>()
      const processor = new InteropBlockProcessor(
        'ethereum',
        [{ name: 'across', capture }],
        mockObject<InteropEventStore>({ saveNewEvents }),
        ready.promise,
        Logger.SILENT,
      )
      const block = makeBlock()

      const processing = processor.processBlock(block, [makeLog()])
      await new Promise<void>((resolve) => setImmediate(resolve))

      expect(capture).not.toHaveBeenCalled()
      expect(saveNewEvents).not.toHaveBeenCalled()
      expect(processor.lastProcessed).toEqual(undefined)

      ready.resolve()
      await processing

      expect(capture).toHaveBeenCalledTimes(1)
      expect(saveNewEvents).toHaveBeenOnlyCalledWith([
        { ...event, plugin: 'across' },
      ])
      expect(processor.lastProcessed).toEqual(block)
    })
  })
})

const TestEvent = createInteropEventType<{ value: number }>('test.Event')

function makeBlock(): Block {
  return {
    number: 100,
    hash: '0xblock',
    logsBloom: '0x',
    timestamp: 1_000,
    transactions: [
      {
        hash: '0xa',
        from: '0x0000000000000000000000000000000000000001',
        to: '0x0000000000000000000000000000000000000002',
        data: '0x',
        type: '0x2',
        value: 0n,
      },
    ],
  }
}

function makeLog(): Log {
  return {
    address: '0x0000000000000000000000000000000000000003',
    topics: ['0x01'],
    data: '0x',
    blockNumber: 100,
    blockHash: '0xblock',
    transactionHash: '0xa',
    logIndex: 0,
  }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}
