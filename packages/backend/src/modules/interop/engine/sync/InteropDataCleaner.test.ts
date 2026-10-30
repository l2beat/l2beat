import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropEventRecord,
  InteropPluginSyncStateRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { describeDatabase } from '../../../../test/database'
import {
  createInteropEventType,
  type InteropEvent,
  type InteropPluginResyncable,
  Result,
} from '../../plugins/types'
import { InteropEventStore } from '../capture/InteropEventStore'
import { match } from '../match/InteropMatchingLoop'
import { getTxsBeforeCutoffs, InteropDataCleaner } from './InteropDataCleaner'
import type {
  InteropEventSyncer,
  ResyncablePluginCluster,
} from './InteropEventSyncer'

describe(InteropDataCleaner.name, () => {
  it('deletes only data after the resync cutoffs', async () => {
    const deleteEvents = mockFn().resolvesTo(0)
    const deleteMessages = mockFn().resolvesTo([
      {
        srcChain: 'arbitrum',
        srcTime: UnixTime(2000),
        srcTxHash: '0xarb',
        dstChain: 'ethereum',
        dstTime: UnixTime(1001),
        dstTxHash: '0xeth',
      },
    ])
    const deleteTransfers = mockFn().resolvesTo([])
    const resetMatchedInTxs = mockFn().resolvesTo(1)
    const deleteSyncedRanges = mockFn().resolvesTo(0)
    const updateByPluginName = mockFn().resolvesTo(2)
    const transaction = mockFn().executes(async (cb) => await cb())

    const db = mockObject<Database>({
      transaction,
      interopMessage: mockObject<Database['interopMessage']>({
        deleteForPluginsAfter: deleteMessages,
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({
        deleteForPluginsAfter: deleteTransfers,
      }),
      interopPluginSyncedRange: mockObject<
        Database['interopPluginSyncedRange']
      >({ deleteByPluginName: deleteSyncedRanges }),
      interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
        findByPluginName: mockFn().resolvesTo([
          makeSyncState('ethereum', true, UnixTime(1000)),
          makeSyncState('arbitrum', true, UnixTime(2000)),
        ]),
        updateByPluginName,
      }),
    })
    const store = mockObject<InteropEventStore>({
      deleteForPluginsAfter: deleteEvents,
      resetMatchedInTxs,
    })

    const loop = new InteropDataCleaner(
      makeCluster(),
      [makeSyncer('ethereum', true), makeSyncer('arbitrum', true)],
      store,
      db,
      Logger.SILENT,
    )

    await loop.run()

    const plugins = ['across', 'wormhole']
    const cutoffs = [
      { chain: 'ethereum', timestamp: UnixTime(1000) },
      { chain: 'arbitrum', timestamp: UnixTime(2000) },
    ]
    expect(transaction).toHaveBeenCalled()
    expect(deleteEvents).toHaveBeenOnlyCalledWith(plugins, cutoffs)
    expect(deleteMessages).toHaveBeenOnlyCalledWith(plugins, cutoffs)
    expect(deleteTransfers).toHaveBeenOnlyCalledWith(plugins, cutoffs)
    expect(resetMatchedInTxs).toHaveBeenOnlyCalledWith(plugins, [
      { chain: 'arbitrum', txHash: '0xarb', timestamp: UnixTime(2000) },
    ])
    expect(deleteSyncedRanges).not.toHaveBeenCalled()
    expect(updateByPluginName).toHaveBeenCalledWith('cluster', {
      wipeRequired: false,
    })
  })

  it('wipes all data and synced ranges on restart from now', async () => {
    const deleteMessage = mockFn().resolvesTo(undefined)
    const deleteTransfer = mockFn().resolvesTo(undefined)
    const deleteEvents = mockFn().resolvesTo(undefined)
    const deleteSyncedRanges = mockFn().resolvesTo(2)
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
      interopPluginSyncedRange: mockObject<
        Database['interopPluginSyncedRange']
      >({ deleteByPluginName: deleteSyncedRanges }),
      interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
        findByPluginName: mockFn().resolvesTo([
          makeSyncState('ethereum', true, null),
          makeSyncState('arbitrum', true, null),
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
    expect(deleteSyncedRanges).toHaveBeenOnlyCalledWith('cluster')
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

describe(getTxsBeforeCutoffs.name, () => {
  const cutoffs = [
    { chain: 'ethereum', timestamp: UnixTime(1000) },
    { chain: 'base', timestamp: UnixTime(1000) },
  ]

  it('returns the txs of sides at or before their chain cutoff', () => {
    const result = getTxsBeforeCutoffs(
      [
        sides(['base', 1000, '0xa'], ['ethereum', 1001, '0xb']),
        sides(['ethereum', 1001, '0xc'], ['base', 999, '0xd']),
        sides(['ethereum', 1001, '0xe'], ['base', 1002, '0xf']),
      ],
      cutoffs,
    )

    expect(result).toEqual([
      { chain: 'base', txHash: '0xa', timestamp: UnixTime(1000) },
      { chain: 'base', txHash: '0xd', timestamp: UnixTime(999) },
    ])
  })

  it('treats chains without a cutoff as not recaptured', () => {
    const result = getTxsBeforeCutoffs(
      [sides(['ethereum', 1001, '0xa'], ['solana', 5000, '0xb'])],
      cutoffs,
    )

    expect(result).toEqual([
      { chain: 'solana', txHash: '0xb', timestamp: UnixTime(5000) },
    ])
  })

  it('skips sides without an event and deduplicates txs', () => {
    const result = getTxsBeforeCutoffs(
      [
        sides(['base', undefined, undefined], ['ethereum', 1001, '0xa']),
        sides(['ethereum', 900, '0xB'], ['base', 1001, '0xc']),
        sides(['ethereum', 900, '0xb'], ['base', 1001, '0xd']),
      ],
      cutoffs,
    )

    expect(result).toEqual([
      { chain: 'ethereum', txHash: '0xb', timestamp: UnixTime(900) },
    ])
  })

  function sides(
    [srcChain, srcTime, srcTxHash]: [
      string,
      number | undefined,
      string | undefined,
    ],
    [dstChain, dstTime, dstTxHash]: [
      string,
      number | undefined,
      string | undefined,
    ],
  ) {
    return {
      srcChain,
      srcTime: srcTime !== undefined ? UnixTime(srcTime) : undefined,
      srcTxHash,
      dstChain,
      dstTime: dstTime !== undefined ? UnixTime(dstTime) : undefined,
      dstTxHash,
    }
  }
})

describeDatabase(`${InteropDataCleaner.name} resync`, (db) => {
  const Src = createInteropEventType<{ key: string }>('test.Src', {
    ttl: 30 * UnixTime.DAY,
  })
  const Sibling = createInteropEventType<{ key: string }>('test.Sibling')
  const Dst = createInteropEventType<{ key: string }>('test.Dst')
  const plugin: InteropPluginResyncable = {
    ...makePlugin('across'),
    matchTypes: [Dst],
    match(dst, events) {
      if (!Dst.checkType(dst)) return
      const src = events.find(Src, { key: dst.args.key })
      if (!src) return
      const sibling = events.find(Sibling, { sameTxAfter: src })
      if (!sibling) return
      return [
        Result.Transfer('test.Transfer', {
          srcEvent: src,
          dstEvent: dst,
          extraEvents: [sibling],
        }),
      ]
    },
  }
  const CUTOFF = UnixTime(1000)

  beforeEach(async () => {
    await db.interopEvent.deleteAll()
    await db.interopTransfer.deleteAll()
    await db.interopMessage.deleteAll()
    await db.interopPluginSyncState.deleteAll()
  })

  it('keeps history before the cutoff and rebuilds straddling transfers once', async () => {
    const pending = event(Src, 'ethereum', 900, '0xa1', 'pending')
    const straddlingSrc = event(Src, 'ethereum', 900, '0xa2', 'straddling')
    const straddlingSibling = event(Sibling, 'ethereum', 900, '0xa2', 'x', 1)
    const straddlingDst = event(Dst, 'arbitrum', 1100, '0xb2', 'straddling')
    const keptSrc = event(Src, 'ethereum', 800, '0xa3', 'kept')
    const keptDst = event(Dst, 'arbitrum', 950, '0xb3', 'kept')
    const recaptured = event(Src, 'ethereum', 1050, '0xa4', 'recaptured')
    const otherCluster = {
      ...event(Src, 'ethereum', 1100, '0xa5', 'other'),
      plugin: 'stargate',
    }
    await db.interopEvent.insertMany([
      toRecord(pending),
      toRecord(straddlingSrc, true),
      toRecord(straddlingSibling, true),
      toRecord(straddlingDst, true),
      toRecord(keptSrc, true),
      toRecord(keptDst, true),
      toRecord(recaptured),
      toRecord(otherCluster),
    ])
    await db.interopTransfer.insertMany([
      transfer('straddling', straddlingSrc, straddlingDst),
      transfer('kept', keptSrc, keptDst),
    ])
    for (const chain of ['ethereum', 'arbitrum']) {
      await db.interopPluginSyncState.setResyncRequestedFrom(
        'cluster',
        chain,
        CUTOFF,
      )
    }
    const store = new InteropEventStore(db, 100, [plugin])
    await store.start()

    await new InteropDataCleaner(
      { name: 'cluster', plugins: [plugin] },
      [makeSyncer('ethereum', true), makeSyncer('arbitrum', true)],
      store,
      db,
      Logger.SILENT,
    ).run()

    const events = await db.interopEvent.getAll()
    expect(events.map((e) => [e.eventId, e.matched] as const)).toEqualUnsorted([
      [pending.eventId, false],
      [straddlingSrc.eventId, false],
      [straddlingSibling.eventId, false],
      [keptSrc.eventId, true],
      [keptDst.eventId, true],
      [otherCluster.eventId, false],
    ])
    expect(
      (await db.interopTransfer.getAll()).map((t) => t.transferId),
    ).toEqual(['kept'])
    expect(store.getEvents(Src.type).map((e) => e.eventId)).toEqualUnsorted([
      pending.eventId,
      straddlingSrc.eventId,
      otherCluster.eventId,
    ])
    expect(
      (await db.interopPluginSyncState.findByPluginName('cluster')).map(
        (s) => s.wipeRequired,
      ),
    ).toEqual([false, false])

    const recapturedDst = event(Dst, 'arbitrum', 1100, '0xb2', 'straddling')
    await store.saveNewEvents([recapturedDst])
    const result = await match(
      store,
      (type) => store.getEvents(type),
      store.getEventTypes(),
      store.getEventCount(),
      [plugin],
      ['ethereum', 'arbitrum'],
      Logger.SILENT,
      new Map(),
    )

    expect(result.transfers).toHaveLength(1)
    expect(result.transfers[0]?.src.event?.eventId).toEqual(
      straddlingSrc.eventId,
    )
    expect(result.transfers[0]?.dst.event?.eventId).toEqual(
      recapturedDst.eventId,
    )
  })

  function event(
    type: typeof Src,
    chain: string,
    timestamp: number,
    txHash: string,
    key: string,
    logIndex = 0,
  ): InteropEvent<{ key: string }> {
    return {
      ...type.createCtx(
        { chain, timestamp: UnixTime(timestamp), txHash, logIndex },
        { key },
      ),
      plugin: plugin.name,
    }
  }

  function toRecord(event: InteropEvent, matched = false): InteropEventRecord {
    return {
      plugin: event.plugin,
      eventId: event.eventId,
      type: event.type,
      direction: undefined,
      expiresAt: event.expiresAt,
      timestamp: event.ctx.timestamp,
      chain: event.ctx.chain,
      blockNumber: 0,
      args: event.args,
      ctx: event.ctx,
      matched,
      unsupported: false,
      derivedFulfilled: false,
      derivedCheckedInHistory: false,
    }
  }

  function transfer(
    transferId: string,
    src: InteropEvent,
    dst: InteropEvent,
  ): InteropTransferRecord {
    return {
      plugin: plugin.name,
      transferId,
      type: 'test.Transfer',
      bridgeType: undefined,
      duration: dst.ctx.timestamp - src.ctx.timestamp,
      timestamp: dst.ctx.timestamp,
      srcTime: src.ctx.timestamp,
      srcChain: src.ctx.chain,
      srcTxHash: src.ctx.txHash,
      srcLogIndex: src.ctx.logIndex,
      srcEventId: src.eventId,
      srcTokenAddress: undefined,
      srcRawAmount: undefined,
      srcWasBurned: undefined,
      srcSymbol: undefined,
      srcAbstractTokenId: undefined,
      srcAmount: undefined,
      srcPrice: undefined,
      srcValueUsd: undefined,
      dstTime: dst.ctx.timestamp,
      dstChain: dst.ctx.chain,
      dstTxHash: dst.ctx.txHash,
      dstLogIndex: dst.ctx.logIndex,
      dstEventId: dst.eventId,
      dstTokenAddress: undefined,
      dstRawAmount: undefined,
      dstWasMinted: undefined,
      dstSymbol: undefined,
      dstAbstractTokenId: undefined,
      dstAmount: undefined,
      dstPrice: undefined,
      dstValueUsd: undefined,
      isProcessed: false,
    }
  }
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
  resyncRequestedFrom: UnixTime | null = UnixTime(1),
): InteropPluginSyncStateRecord {
  return {
    pluginName: 'cluster',
    chain,
    lastError: null,
    resyncRequestedFrom,
    wipeRequired,
  }
}
