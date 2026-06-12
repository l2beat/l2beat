import { expect } from 'earl'
import {
  createInteropEventType,
  type InteropPluginResyncable,
  txFromEvent,
} from '../../plugins/types'
import { DerivedTxStore } from './DerivedTxStore'

describe(DerivedTxStore.name, () => {
  it('indexes a derived tx request for a matching creator event', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
    }>('test.CreatorEvent')
    const plugin: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
      ],
    }
    const creatorEvent = {
      ...CreatorEvent.mock({
        chain: 'base',
        txHash: '0xabc',
      }),
      plugin: plugin.name,
    }

    const store = new DerivedTxStore([plugin])
    store.onEventCreated(creatorEvent)

    expect(store.getCount()).toEqual(1)
    expect(store.get('base', '0xabc')).toEqual([
      {
        chain: 'base',
        txHash: '0xabc',
        creatorEvent,
        checkedInHistory: false,
      },
    ])
    expect(store.getHashesPendingHistoryCheck('base', ['across'])).toEqual([
      '0xabc',
    ])
  })

  it('throws when a creator event type defines multiple derived tx requests', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
      altTxHash: string
    }>('test.CreatorEvent')
    const plugin: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'altTxHash',
        }),
      ],
    }
    expect(() => new DerivedTxStore([plugin])).toThrow(
      /Multiple derived tx requests/,
    )
  })

  it('removes derived tx requests for removed creator events', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
    }>('test.CreatorEvent')
    const plugin: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
      ],
    }
    const creatorEvent = {
      ...CreatorEvent.mock({
        chain: 'base',
        txHash: '0xabc',
      }),
      plugin: plugin.name,
    }

    const store = new DerivedTxStore([plugin])
    store.onEventCreated(creatorEvent)
    store.onEventsRemoved([creatorEvent])

    expect(store.getCount()).toEqual(0)
    expect(store.get('base', '0xabc')).toEqual([])
  })

  it('new creator event for same tx hash is pending even after first was checked', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
    }>('test.CreatorEvent')
    const plugin: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
      ],
    }
    const firstEvent = {
      ...CreatorEvent.mock({
        chain: 'base',
        txHash: '0xabc',
      }),
      plugin: plugin.name,
    }
    const secondEvent = {
      ...CreatorEvent.mock({
        chain: 'base',
        txHash: '0xabc',
      }),
      plugin: plugin.name,
    }

    const store = new DerivedTxStore([plugin])
    store.onEventCreated(firstEvent)
    store.markCheckedInHistory('base', ['0xabc'], ['across'])

    expect(store.getHashesPendingHistoryCheck('base', ['across'])).toEqual([])

    store.onEventCreated(secondEvent)

    expect(store.getHashesPendingHistoryCheck('base', ['across'])).toEqual([
      '0xabc',
    ])
  })

  it('does not return checked entries as pending', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
    }>('test.CreatorEvent')
    const plugin: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
      ],
    }
    const creatorEvent = {
      ...CreatorEvent.mock({
        chain: 'base',
        txHash: '0xabc',
      }),
      plugin: plugin.name,
    }

    const store = new DerivedTxStore([plugin])
    store.onEventCreated(creatorEvent, true)

    expect(store.getHashesPendingHistoryCheck('base', ['across'])).toEqual([])
    expect(store.getCount()).toEqual(1)
  })

  it('only returns hashes for the requested plugins', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
    }>('test.CreatorEvent')
    const pluginA: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
      ],
    }
    const pluginB: InteropPluginResyncable = {
      name: 'wormhole',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
      ],
    }
    const eventA = {
      ...CreatorEvent.mock({ chain: 'base', txHash: '0xaaa' }),
      plugin: pluginA.name,
    }
    const eventB = {
      ...CreatorEvent.mock({ chain: 'base', txHash: '0xbbb' }),
      plugin: pluginB.name,
    }

    const store = new DerivedTxStore([pluginA, pluginB])
    store.onEventCreated(eventA)
    store.onEventCreated(eventB)

    expect(store.getHashesPendingHistoryCheck('base', ['across'])).toEqual([
      '0xaaa',
    ])
    expect(store.getHashesPendingHistoryCheck('base', ['wormhole'])).toEqual([
      '0xbbb',
    ])
    expect(
      store.getHashesPendingHistoryCheck('base', ['across', 'wormhole']),
    ).toEqual(['0xaaa', '0xbbb'])
  })

  it('markCheckedInHistory returns affected creator events', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
    }>('test.CreatorEvent')
    const plugin: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        txFromEvent({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
      ],
    }
    const creatorEvent = {
      ...CreatorEvent.mock({ chain: 'base', txHash: '0xabc' }),
      plugin: plugin.name,
    }

    const store = new DerivedTxStore([plugin])
    store.onEventCreated(creatorEvent)

    const marked = store.markCheckedInHistory('base', ['0xabc'], ['across'])

    expect(marked).toEqual([creatorEvent])
    expect(store.getHashesPendingHistoryCheck('base', ['across'])).toEqual([])
  })
})
