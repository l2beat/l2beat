import type { Database, InteropEventRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
    const insertMany = mockFn().resolvesTo(undefined)
    const store = makeStore(plugin, {
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany,
        getUnmatched: mockFn().resolvesTo([]),
      }),
    })

    await store.saveNewEvents([event])

    expect(insertMany).toHaveBeenCalled()
    expect(store.derivedTxStore.get('base', '0xabc')).toEqual([
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
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        getUnmatched: mockFn().resolvesTo([toRecord(event)]),
      }),
    })

    await store.start()

    expect(store.getEvents(CreatorEvent.type)).toEqual([event])
    expect(store.derivedTxStore.get('base', '0xabc')).toEqual([
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
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        getUnmatched: mockFn().resolvesTo([
          toRecord(event, { derivedCheckedInHistory: true }),
        ]),
      }),
    })

    await store.start()

    expect(store.derivedTxStore.get('base', '0xabc')).toEqual([
      {
        chain: 'base',
        txHash: '0xabc',
        creatorEvent: event,
        checkedInHistory: true,
      },
    ])
    expect(
      store.derivedTxStore.getHashesPendingHistoryCheck('base', [plugin.name]),
    ).toEqual([])
  })

  it('does not rebuild fulfilled derived tx requests on start', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        getUnmatched: mockFn().resolvesTo([
          toRecord(event, { derivedFulfilled: true }),
        ]),
      }),
    })

    await store.start()

    expect(store.getEvents(CreatorEvent.type)).toEqual([event])
    expect(store.derivedTxStore.getCount()).toEqual(0)
  })

  it('removes derived tx requests for matched and unsupported events', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      transaction: mockFn().executes(async (cb) => await cb()),
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        getUnmatched: mockFn().resolvesTo([]),
        updateMatched: mockFn().resolvesTo(undefined),
        updateUnsupported: mockFn().resolvesTo(undefined),
      }),
    })

    await store.saveNewEvents([event])
    await store.updateMatchedAndUnsupported({
      matched: [event],
      unsupported: [],
    })

    expect(store.derivedTxStore.getCount()).toEqual(0)
  })

  it('removes expired derived tx requests', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin, { expiresAt: UnixTime(5) })
    const store = makeStore(plugin, {
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        getUnmatched: mockFn().resolvesTo([]),
        deleteExpired: mockFn().resolvesTo(1),
      }),
    })

    await store.saveNewEvents([event])
    await store.deleteExpired(UnixTime(10))

    expect(store.derivedTxStore.getCount()).toEqual(0)
  })

  it('removes derived tx requests when deleting all events for a plugin', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const store = makeStore(plugin, {
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        getUnmatched: mockFn().resolvesTo([]),
        deleteAllForPlugin: mockFn().resolvesTo(1),
      }),
    })

    await store.saveNewEvents([event])
    await store.deleteAllForPlugin(plugin.name)

    expect(store.derivedTxStore.getCount()).toEqual(0)
  })

  it('deletes events newer than their chain cutoff from the db and memory', async () => {
    const plugin = makePlugin()
    const kept = makeEvent(plugin, { chain: 'base', timestamp: 100 })
    const deleted = makeEvent(plugin, {
      chain: 'base',
      timestamp: 101,
      txHash: '0xdef',
    })
    const noCutoff = makeEvent(plugin, { chain: 'arbitrum', timestamp: 101 })
    const otherPlugin = {
      ...makeEvent(plugin, { chain: 'base', timestamp: 101 }),
      plugin: 'wormhole',
    }
    const deleteForPluginsAfter = mockFn().resolvesTo(1)
    const store = makeStore(plugin, {
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        deleteForPluginsAfter,
      }),
    })
    const cutoffs = [{ chain: 'base', timestamp: UnixTime(100) }]

    await store.saveNewEvents([kept, deleted, noCutoff, otherPlugin])
    await store.deleteForPluginsAfter([plugin.name], cutoffs)

    expect(deleteForPluginsAfter).toHaveBeenOnlyCalledWith(
      [plugin.name],
      cutoffs,
    )
    expect(store.getEvents(CreatorEvent.type)).toEqualUnsorted([
      kept,
      noCutoff,
      otherPlugin,
    ])
    expect(store.derivedTxStore.get('base', '0xdef')).toEqual([])
  })

  it('puts events reset in the db back into memory', async () => {
    const plugin = makePlugin()
    const event = makeEvent(plugin)
    const resetMatchedInTxs = mockFn().resolvesTo([toRecord(event)])
    const store = makeStore(plugin, {
      interopEvent: mockObject<Database['interopEvent']>({
        resetMatchedInTxs,
      }),
    })
    const txs = [{ chain: 'base', txHash: '0x123', timestamp: UnixTime(100) }]

    await store.resetMatchedInTxs([plugin.name], txs)

    expect(resetMatchedInTxs).toHaveBeenOnlyCalledWith([plugin.name], txs)
    expect(store.getEvents(CreatorEvent.type)).toEqual([event])
    expect(store.derivedTxStore.get('base', '0xabc')).toEqual([
      {
        chain: 'base',
        txHash: '0xabc',
        creatorEvent: event,
        checkedInHistory: false,
      },
    ])
  })

  it('removes evicted derived tx requests when the in-memory event cap is hit', async () => {
    const plugin = makePlugin()
    const firstEvent = makeEvent(plugin, { txHash: '0xabc', expiresAt: 1 })
    const secondEvent = makeEvent(plugin, { txHash: '0xdef', expiresAt: 2 })
    const store = makeStore(
      plugin,
      {
        interopEvent: mockObject<Database['interopEvent']>({
          insertMany: mockFn().resolvesTo(undefined),
          getUnmatched: mockFn().resolvesTo([]),
        }),
      },
      1,
    )

    await store.saveNewEvents([firstEvent, secondEvent])

    expect(store.derivedTxStore.get('base', '0xabc')).toEqual([])
    expect(store.derivedTxStore.get('base', '0xdef')).toEqual([
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
    const updateDerivedFulfilled = mockFn().resolvesTo(undefined)
    const store = makeStore(plugin, {
      interopEvent: mockObject<Database['interopEvent']>({
        insertMany: mockFn().resolvesTo(undefined),
        getUnmatched: mockFn().resolvesTo([]),
        updateDerivedFulfilled,
      }),
    })

    await store.saveNewEvents([event])
    await store.updateDerivedFulfilled([event])

    expect(updateDerivedFulfilled).toHaveBeenCalledWith([event.eventId])
    expect(store.derivedTxStore.getCount()).toEqual(0)
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
  overrides: {
    txHash?: string
    expiresAt?: number
    chain?: string
    timestamp?: number
  } = {},
) {
  const event = CreatorEvent.mock(
    {
      chain: 'base',
      txHash: overrides.txHash ?? '0xabc',
    },
    overrides.expiresAt,
  )
  return {
    ...event,
    ctx: {
      ...event.ctx,
      chain: overrides.chain ?? event.ctx.chain,
      timestamp: UnixTime(overrides.timestamp ?? event.ctx.timestamp),
    },
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
  return mockObject<Database>({
    ...overrides,
  })
}
