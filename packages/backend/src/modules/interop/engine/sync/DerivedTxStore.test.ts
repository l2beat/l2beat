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
      },
    ])
    expect(store.takePendingTxHashes('base')).toEqual(['0xabc'])
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

  it('requeues the same tx hash when another creator event for it appears later', () => {
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
    expect(store.takePendingTxHashes('base')).toEqual(['0xabc'])

    store.onEventCreated(secondEvent)

    expect(store.takePendingTxHashes('base')).toEqual(['0xabc'])
  })
})
