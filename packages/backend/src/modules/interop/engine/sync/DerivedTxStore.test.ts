import { expect } from 'earl'
import {
  createDerivedTxRequest,
  createInteropEventType,
  type InteropPluginResyncable,
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
        createDerivedTxRequest({
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

  it('indexes multiple derived tx requests for the same creator event type', () => {
    const CreatorEvent = createInteropEventType<{
      chain: string
      txHash: string
      altTxHash: string
    }>('test.CreatorEvent')
    const plugin: InteropPluginResyncable = {
      name: 'across',
      capture: () => undefined,
      getDataRequests: () => [
        createDerivedTxRequest({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'txHash',
        }),
        createDerivedTxRequest({
          creatorEvent: CreatorEvent,
          chainArg: 'chain',
          txHashArg: 'altTxHash',
        }),
      ],
    }
    const creatorEvent = {
      ...CreatorEvent.mock({
        chain: 'base',
        txHash: '0xabc',
        altTxHash: '0xdef',
      }),
      plugin: plugin.name,
    }

    const store = new DerivedTxStore([plugin])
    store.onEventCreated(creatorEvent)

    expect(store.getCount()).toEqual(2)
    expect(store.get('base', '0xabc')).toEqual([
      {
        chain: 'base',
        txHash: '0xabc',
        creatorEvent,
      },
    ])
    expect(store.get('base', '0xdef')).toEqual([
      {
        chain: 'base',
        txHash: '0xdef',
        creatorEvent,
      },
    ])
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
        createDerivedTxRequest({
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
        createDerivedTxRequest({
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
