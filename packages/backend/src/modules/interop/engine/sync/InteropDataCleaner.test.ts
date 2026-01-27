import { Logger } from '@l2beat/backend-tools'
import type { Database, InteropPluginSyncStateRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropPluginResyncable } from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropDataCleaner } from './InteropDataCleaner'
import type {
  InteropEventSyncer,
  ResyncablePluginCluster,
} from './InteropEventSyncer'

describe(InteropDataCleaner.name, () => {
  it('wipes data when all syncers are waiting and wipeRequired is set', async () => {
    const deleteMessage = mockFn().resolvesTo(undefined)
    const deleteTransfer = mockFn().resolvesTo(undefined)
    const deleteEvents = mockFn().resolvesTo(undefined)
    const updateByPluginName = mockFn().resolvesTo(2)
    const transaction = mockFn().executes(async (cb) => await cb())

    const db = mockObject<Database>({
      transaction,
      interopMessage: mockObject<Database['interopMessage']>({
        deleteForPlugin: deleteMessage,
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({
        deleteForPlugin: deleteTransfer,
      }),
      interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
        findByPluginName: mockFn().resolvesTo([
          makeSyncState('ethereum', true),
          makeSyncState('arbitrum', true),
        ]),
        updateByPluginName,
      }),
    })
    const store = mockObject<InteropEventStore>({
      deleteAllForPlugin: deleteEvents,
    })

    const loop = new InteropDataCleaner(
      makeCluster(),
      [makeSyncer('ethereum', true), makeSyncer('arbitrum', true)],
      store,
      db,
      Logger.SILENT,
    )

    await loop.run()

    expect(transaction).toHaveBeenCalled()
    expect(deleteMessage).toHaveBeenCalledTimes(2)
    expect(deleteTransfer).toHaveBeenCalledTimes(2)
    expect(deleteEvents).toHaveBeenCalledTimes(2)
    expect(deleteMessage).toHaveBeenCalledWith('across')
    expect(deleteMessage).toHaveBeenCalledWith('wormhole')
    expect(updateByPluginName).toHaveBeenCalledWith('cluster', {
      wipeRequired: false,
    })
  })

  it('does not wipe when some syncers are not waiting', async () => {
    const deleteMessage = mockFn().resolvesTo(undefined)
    const deleteTransfer = mockFn().resolvesTo(undefined)
    const deleteEvents = mockFn().resolvesTo(undefined)
    const updateByPluginName = mockFn().resolvesTo(0)
    const transaction = mockFn().executes(async (cb) => await cb())

    const db = mockObject<Database>({
      transaction,
      interopMessage: mockObject<Database['interopMessage']>({
        deleteForPlugin: deleteMessage,
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({
        deleteForPlugin: deleteTransfer,
      }),
      interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
        findByPluginName: mockFn().resolvesTo([
          makeSyncState('ethereum', true),
          makeSyncState('arbitrum', true),
        ]),
        updateByPluginName,
      }),
    })
    const store = mockObject<InteropEventStore>({
      deleteAllForPlugin: deleteEvents,
    })

    const loop = new InteropDataCleaner(
      makeCluster(),
      [makeSyncer('ethereum', true), makeSyncer('arbitrum', false)],
      store,
      db,
      Logger.SILENT,
    )

    await loop.run()

    expect(transaction).not.toHaveBeenCalled()
    expect(deleteMessage).not.toHaveBeenCalled()
    expect(deleteTransfer).not.toHaveBeenCalled()
    expect(deleteEvents).not.toHaveBeenCalled()
    expect(updateByPluginName).not.toHaveBeenCalled()
  })

  it('does not wipe when wipeRequired is missing for any chain', async () => {
    const deleteMessage = mockFn().resolvesTo(undefined)
    const deleteTransfer = mockFn().resolvesTo(undefined)
    const deleteEvents = mockFn().resolvesTo(undefined)
    const updateByPluginName = mockFn().resolvesTo(0)
    const transaction = mockFn().executes(async (cb) => await cb())

    const db = mockObject<Database>({
      transaction,
      interopMessage: mockObject<Database['interopMessage']>({
        deleteForPlugin: deleteMessage,
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({
        deleteForPlugin: deleteTransfer,
      }),
      interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
        findByPluginName: mockFn().resolvesTo([
          makeSyncState('ethereum', true),
          makeSyncState('arbitrum', false),
        ]),
        updateByPluginName,
      }),
    })
    const store = mockObject<InteropEventStore>({
      deleteAllForPlugin: deleteEvents,
    })

    const loop = new InteropDataCleaner(
      makeCluster(),
      [makeSyncer('ethereum', true), makeSyncer('arbitrum', true)],
      store,
      db,
      Logger.SILENT,
    )

    await loop.run()

    expect(transaction).not.toHaveBeenCalled()
    expect(deleteMessage).not.toHaveBeenCalled()
    expect(deleteTransfer).not.toHaveBeenCalled()
    expect(deleteEvents).not.toHaveBeenCalled()
    expect(updateByPluginName).not.toHaveBeenCalled()
  })
})

function makeCluster(): ResyncablePluginCluster {
  return {
    name: 'cluster',
    plugins: [makePlugin('across'), makePlugin('wormhole')],
  }
}

function makePlugin(name: string): InteropPluginResyncable {
  return {
    name: name as InteropPluginResyncable['name'],
    capture: () => undefined,
    getDataRequests: () => [],
  }
}

function makeSyncer(
  chain: string,
  waitingForWipe: boolean,
): InteropEventSyncer {
  return mockObject<InteropEventSyncer>({
    chain: chain as InteropEventSyncer['chain'],
    waitingForWipe,
  })
}

function makeSyncState(
  chain: string,
  wipeRequired: boolean,
): InteropPluginSyncStateRecord {
  return {
    pluginName: 'cluster',
    chain,
    lastError: null,
    resyncRequestedFrom: UnixTime(1),
    wipeRequired,
  }
}
