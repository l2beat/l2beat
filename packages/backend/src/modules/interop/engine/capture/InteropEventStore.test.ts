import type { Database, InteropEventRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import {
  createInteropEventType,
  type InteropEvent,
  type InteropEventType,
  type InteropPluginResyncable,
  txFromEvent,
} from '../../plugins/types'
import { InteropEventStore } from './InteropEventStore'

describe(InteropEventStore.name, () => {
  it('indexes derived tx requests for newly saved events', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const insertMany = vi.fn().mockResolvedValue(undefined)
    const store = makeStore(plugin, {
      interopEvent: {
        insertMany,
        getUnmatched: vi.fn().mockResolvedValue([]),
      } as unknown as Database['interopEvent'],
    })

    await store.saveNewEvents([event])

    expect(insertMany).toHaveBeenCalled()
    expect(store.derivedTxStore.get('base', '0xabc')).toStrictEqual([
      {
        chain: 'base',
        txHash: '0xabc',
        creatorEvent: event,
        checkedInHistory: false,
      },
    ])
  })

  it('rebuilds the derived tx index on start', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      interopEvent: {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getUnmatched: vi.fn().mockResolvedValue([toRecord(event)]),
      } as unknown as Database['interopEvent'],
    })

    await store.start()

    expect(store.getEvents(CreatorEvent.type)).toStrictEqual([event])
    expect(store.derivedTxStore.get('base', '0xabc')).toStrictEqual([
      {
        chain: 'base',
        txHash: '0xabc',
        creatorEvent: event,
        checkedInHistory: false,
      },
    ])
  })

  it('preserves derivedCheckedInHistory flag on start', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      interopEvent: {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getUnmatched: vi
          .fn()
          .mockResolvedValue([
            toRecord(event, { derivedCheckedInHistory: true }),
          ]),
      } as unknown as Database['interopEvent'],
    })

    await store.start()

    expect(store.derivedTxStore.get('base', '0xabc')).toStrictEqual([
      {
        chain: 'base',
        txHash: '0xabc',
        creatorEvent: event,
        checkedInHistory: true,
      },
    ])
    expect(
      store.derivedTxStore.getHashesPendingHistoryCheck('base', [plugin.name]),
    ).toStrictEqual([])
  })

  it('does not rebuild fulfilled derived tx requests on start', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      interopEvent: {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getUnmatched: vi
          .fn()
          .mockResolvedValue([toRecord(event, { derivedFulfilled: true })]),
      } as unknown as Database['interopEvent'],
    })

    await store.start()

    expect(store.getEvents(CreatorEvent.type)).toStrictEqual([event])
    expect(store.derivedTxStore.getCount()).toStrictEqual(0)
  })

  it('removes derived tx requests for matched and unsupported events', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      transaction: vi.fn().mockImplementation(async (cb) => await cb()),
      interopEvent: {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getUnmatched: vi.fn().mockResolvedValue([]),
        updateMatched: vi.fn().mockResolvedValue(undefined),
        updateUnsupported: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['interopEvent'],
    })

    await store.saveNewEvents([event])
    await store.updateMatchedAndUnsupported({
      matched: [event],
      unsupported: [],
    })

    expect(store.derivedTxStore.getCount()).toStrictEqual(0)
  })

  it('removes expired derived tx requests', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin, { expiresAt: UnixTime(5) })
    const store = makeStore(plugin, {
      interopEvent: {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getUnmatched: vi.fn().mockResolvedValue([]),
        deleteExpired: vi.fn().mockResolvedValue(1),
      } as unknown as Database['interopEvent'],
    })

    await store.saveNewEvents([event])
    await store.deleteExpired(UnixTime(10))

    expect(store.derivedTxStore.getCount()).toStrictEqual(0)
  })

  it('removes derived tx requests when deleting all events for a plugin', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      interopEvent: {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getUnmatched: vi.fn().mockResolvedValue([]),
        deleteAllForPlugin: vi.fn().mockResolvedValue(1),
      } as unknown as Database['interopEvent'],
    })

    await store.saveNewEvents([event])
    await store.deleteAllForPlugin(plugin.name)

    expect(store.derivedTxStore.getCount()).toStrictEqual(0)
  })

  it('removes evicted derived tx requests when the in-memory event cap is hit', async () => {
    const plugin = makePlugin()
    const firstEvent = makeEvent(plugin, { txHash: '0xabc', expiresAt: 1 })
    const secondEvent = makeEvent(plugin, { txHash: '0xdef', expiresAt: 2 })
    const store = makeStore(
      plugin,
      {
        interopEvent: {
          insertMany: vi.fn().mockResolvedValue(undefined),
          getUnmatched: vi.fn().mockResolvedValue([]),
        } as unknown as Database['interopEvent'],
      },
      1,
    )

    await store.saveNewEvents([firstEvent, secondEvent])

    expect(store.derivedTxStore.get('base', '0xabc')).toStrictEqual([])
    expect(store.derivedTxStore.get('base', '0xdef')).toStrictEqual([
      {
        chain: 'base',
        txHash: '0xdef',
        creatorEvent: secondEvent,
        checkedInHistory: false,
      },
    ])
  })

  it('marks derived tx requests as fulfilled and removes them from memory', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const updateDerivedFulfilled = vi.fn().mockResolvedValue(undefined)
    const store = makeStore(plugin, {
      interopEvent: {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getUnmatched: vi.fn().mockResolvedValue([]),
        updateDerivedFulfilled,
      } as unknown as Database['interopEvent'],
    })

    await store.saveNewEvents([event])
    await store.updateDerivedFulfilled([event])

    expect(updateDerivedFulfilled).toHaveBeenCalledWith([event.eventId])
    expect(store.derivedTxStore.getCount()).toStrictEqual(0)
  })
})

const CreatorEvent = createInteropEventType<{
  chain: string
  txHash: string
}>('test.CreatorEvent')

function makePlugin(
  creatorEvent: InteropEventType<{
    chain: string
    txHash: string
  }> = CreatorEvent,
): InteropPluginResyncable {
  return {
    name: 'across',
    capture: () => undefined,
    getDataRequests: () => [
      txFromEvent({
        creatorEvent,
        chainArg: 'chain',
        txHashArg: 'txHash',
      }),
    ],
  }
}

function makeEvent(
  plugin: InteropPluginResyncable,
  overrides: { txHash?: string; expiresAt?: number } = {},
) {
  return {
    ...CreatorEvent.mock(
      {
        chain: 'base',
        txHash: overrides.txHash ?? '0xabc',
      },
      overrides.expiresAt,
    ),
    plugin: plugin.name,
  }
}

function makeStore(
  plugin: InteropPluginResyncable,
  overrides: Partial<Database> = {},
  inMemoryLimit = 100,
) {
  return new InteropEventStore(mockDb(overrides), inMemoryLimit, [plugin])
}

function toRecord(
  event: InteropEvent,
  overrides: Partial<InteropEventRecord> = {},
): InteropEventRecord {
  return {
    plugin: event.plugin,
    eventId: event.eventId,
    type: event.type,
    direction: event.direction,
    expiresAt: event.expiresAt,
    args: event.args,
    chain: event.ctx.chain,
    timestamp: event.ctx.timestamp,
    matched: false,
    unsupported: false,
    derivedFulfilled: false,
    derivedCheckedInHistory: false,
    ctx: event.ctx,
    blockNumber: 0,
    ...overrides,
  }
}

function mockDb(overrides: Partial<Database> = {}): Database {
  return {
    ...overrides,
  } as unknown as Database
}
