import { Logger } from '@l2beat/backend-tools'
import type {
  BlockRangeWithTimestamps,
  InteropEventRecord,
} from '@l2beat/database'
import { type Block, type Log, UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type {
  InteropEvent,
  LogToCapture,
  TxToCapture,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { CatchingUpState } from './CatchingUpState'
import type { DerivedTxStore } from './DerivedTxStore'
import { FollowingState } from './FollowingState'
import type { InteropEventSyncer } from './InteropEventSyncer'

const BLOCK = makeBlock(100, UnixTime(1_000))
const LOGS: Log[] = [{} as unknown as Log]

describe(FollowingState.name, () => {
  describe(FollowingState.prototype.checkStatus.name, () => {
    it('switches to catching up when resync is requested', async () => {
      const syncer = createSyncer({
        getResyncState: vi.fn().mockResolvedValue({
          resyncFrom: UnixTime(1),
          wipeRequired: false,
        }),
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.checkStatus()

      expect(nextState).toBeInstanceOf(CatchingUpState)
    })

    it('switches to catching up when wipe is required without new blocks', async () => {
      const getLastSyncedRange = vi.fn().mockResolvedValue(makeSyncedRange())
      const syncer = createSyncer({
        getResyncState: vi.fn().mockResolvedValue({
          resyncFrom: undefined,
          wipeRequired: true,
        }),
        getLastSyncedRange,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.checkStatus()

      expect(nextState).toBeInstanceOf(CatchingUpState)
      expect(getLastSyncedRange).not.toHaveBeenCalled()
    })

    it('returns itself when there is no resync request', async () => {
      const getLastSyncedRange = vi.fn().mockResolvedValue(makeSyncedRange())
      const syncer = createSyncer({
        getResyncState: vi.fn().mockResolvedValue({
          resyncFrom: undefined,
          wipeRequired: false,
        }),
        getLastSyncedRange,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.checkStatus()

      expect(nextState).toStrictEqual(state)
      expect(getLastSyncedRange).not.toHaveBeenCalled()
    })
  })

  describe(FollowingState.prototype.processNewestBlock.name, () => {
    it('switches to catching up when resync is requested', async () => {
      const getLastSyncedRange = vi.fn().mockResolvedValue(undefined)
      const getItemsToCapture = vi.fn().mockReturnValue({
        logsToCapture: [],
        txsToCapture: [],
      })
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getResyncState: vi.fn().mockResolvedValue({
          resyncFrom: UnixTime(1),
          wipeRequired: false,
        }),
        getLastSyncedRange,
        getItemsToCapture,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toBeInstanceOf(CatchingUpState)
      expect(getLastSyncedRange).not.toHaveBeenCalled()
      expect(getItemsToCapture).not.toHaveBeenCalled()
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('switches to catching up when there is a gap larger than one block', async () => {
      const getItemsToCapture = vi.fn().mockReturnValue({
        logsToCapture: [],
        txsToCapture: [],
      })
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ toBlock: 98n })),
        getItemsToCapture,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toBeInstanceOf(CatchingUpState)
      expect(getItemsToCapture).not.toHaveBeenCalled()
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('ignores block when already synced at or past it', async () => {
      const getItemsToCapture = vi.fn().mockReturnValue({
        logsToCapture: [],
        txsToCapture: [],
      })
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ toBlock: 100n })),
        getItemsToCapture,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toStrictEqual(state)
      expect(getItemsToCapture).not.toHaveBeenCalled()
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('processes the next block when exactly one behind', async () => {
      const logA = {} as unknown as LogToCapture
      const logB = {} as unknown as LogToCapture
      const eventA = {} as unknown as InteropEvent
      const eventB = {} as unknown as InteropEvent
      const eventC = {} as unknown as InteropEvent
      const captureLog = vi
        .fn()
        .mockReturnValueOnce([eventA])
        .mockReturnValueOnce([eventB, eventC])
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 90n, toBlock: 99n })),
        getItemsToCapture: vi.fn().mockReturnValue({
          logsToCapture: [logA, logB],
          txsToCapture: [],
        }),
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toStrictEqual(state)
      expect(captureLog).toHaveBeenNthCalledWith(1, logA)
      expect(captureLog).toHaveBeenNthCalledWith(2, logB)
      expect(saveProducedInteropEvents).toHaveBeenCalledWith(
        [eventA, eventB, eventC],
        {
          fromBlock: 90n,
          fromTimestamp: UnixTime(0),
          toBlock: 100n,
          toTimestamp: UnixTime(1_000),
        },
        [],
        [],
      )
    })

    it('bootstraps range from the oldest event when no synced range exists', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi.fn().mockResolvedValue(undefined),
        getOldestEventForPluginAndChain: vi.fn().mockResolvedValue(
          makeInteropEventRecord({
            blockNumber: 7,
            timestamp: UnixTime(70),
          }),
        ),
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(saveProducedInteropEvents).toHaveBeenCalledWith(
        [],
        {
          fromBlock: 7n,
          fromTimestamp: UnixTime(70),
          toBlock: 100n,
          toTimestamp: UnixTime(1_000),
        },
        [],
        [],
      )
    })

    it('bootstraps range from the incoming block when no events exist', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi.fn().mockResolvedValue(undefined),
        getOldestEventForPluginAndChain: vi.fn().mockResolvedValue(undefined),
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(saveProducedInteropEvents).toHaveBeenCalledWith(
        [],
        {
          fromBlock: 100n,
          fromTimestamp: UnixTime(1_000),
          toBlock: 100n,
          toTimestamp: UnixTime(1_000),
        },
        [],
        [],
      )
    })

    it('saves an empty events list when nothing is captured', async () => {
      const logA = {} as unknown as LogToCapture
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ toBlock: 99n })),
        getItemsToCapture: vi.fn().mockReturnValue({
          logsToCapture: [logA],
          txsToCapture: [],
        }),
        captureLog: vi.fn().mockReturnValueOnce(undefined),
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(saveProducedInteropEvents).toHaveBeenCalledWith(
        [],
        {
          fromBlock: 90n,
          fromTimestamp: UnixTime(0),
          toBlock: 100n,
          toTimestamp: UnixTime(1_000),
        },
        [],
        [],
      )
    })

    it('delegates tx capture to the syncer once per tx', async () => {
      const txToCapture = {
        chain: 'base',
        tx: { hash: '0x123' } as unknown as TxToCapture['tx'],
      } as unknown as TxToCapture
      const txEvent = {} as unknown as InteropEvent
      const captureTx = vi.fn().mockReturnValueOnce({
        events: [txEvent],
        fulfilledCreatorEvents: [],
      })
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 90n, toBlock: 99n })),
        getItemsToCapture: vi.fn().mockReturnValue({
          logsToCapture: [],
          txsToCapture: [txToCapture],
        }),
        captureTx,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(captureTx).toHaveBeenCalledWith(txToCapture)
      expect(saveProducedInteropEvents).toHaveBeenCalledWith(
        [txEvent],
        {
          fromBlock: 90n,
          fromTimestamp: UnixTime(0),
          toBlock: 100n,
          toTimestamp: UnixTime(1_000),
        },
        [],
        [],
      )
    })

    it('reads the resync state and synced range once for consecutive blocks', async () => {
      const getResyncState = vi.fn().mockResolvedValue({
        resyncFrom: undefined,
        wipeRequired: false,
      })
      const getLastSyncedRange = vi
        .fn()
        .mockResolvedValue(makeSyncedRange({ fromBlock: 90n, toBlock: 99n }))
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getResyncState,
        getLastSyncedRange,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)
      await state.processNewestBlock(makeBlock(101, UnixTime(1_010)), LOGS)

      expect(getResyncState).toHaveBeenCalledTimes(1)
      expect(getLastSyncedRange).toHaveBeenCalledTimes(1)
      expect(saveProducedInteropEvents).toHaveBeenCalledTimes(2)
      expect(saveProducedInteropEvents.mock.calls[1][1]).toStrictEqual({
        fromBlock: 90n,
        fromTimestamp: UnixTime(0),
        toBlock: 101n,
        toTimestamp: UnixTime(1_010),
      })
    })

    it('does not advance the cached range when saving fails', async () => {
      const getLastSyncedRange = vi
        .fn()
        .mockResolvedValue(makeSyncedRange({ fromBlock: 90n, toBlock: 99n }))
      const saveProducedInteropEvents = vi
        .fn()
        .mockRejectedValueOnce(new Error('db down'))
        .mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await expect(state.processNewestBlock(BLOCK, LOGS)).rejects.toThrow(
        'db down',
      )
      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toStrictEqual(state)
      expect(getLastSyncedRange).toHaveBeenCalledTimes(1)
      expect(saveProducedInteropEvents).toHaveBeenCalledTimes(2)
      expect(saveProducedInteropEvents.mock.calls[1][1]).toStrictEqual(
        saveProducedInteropEvents.mock.calls[0][1],
      )
    })

    it('checks for a resync request again after the interval', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(1_000_000)
      try {
        const getResyncState = vi
          .fn()
          .mockResolvedValueOnce({ resyncFrom: undefined, wipeRequired: false })
          .mockResolvedValue({ resyncFrom: UnixTime(1), wipeRequired: false })
        const syncer = createSyncer({
          getResyncState,
          getLastSyncedRange: vi
            .fn()
            .mockResolvedValue(
              makeSyncedRange({ fromBlock: 90n, toBlock: 99n }),
            ),
        })
        const state = new FollowingState(syncer, Logger.SILENT)

        await state.processNewestBlock(BLOCK, LOGS)
        vi.advanceTimersByTime(9_999)
        const sameState = await state.processNewestBlock(
          makeBlock(101, UnixTime(1_010)),
          LOGS,
        )
        vi.advanceTimersByTime(1)
        const nextState = await state.processNewestBlock(
          makeBlock(102, UnixTime(1_020)),
          LOGS,
        )

        expect(sameState).toStrictEqual(state)
        expect(nextState).toBeInstanceOf(CatchingUpState)
        expect(getResyncState).toHaveBeenCalledTimes(2)
      } finally {
        vi.useRealTimers()
      }
    })

    it('counts a status check as a resync check', async () => {
      const getResyncState = vi.fn().mockResolvedValue({
        resyncFrom: undefined,
        wipeRequired: false,
      })
      const syncer = createSyncer({
        getResyncState,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 90n, toBlock: 99n })),
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.checkStatus()
      await state.processNewestBlock(BLOCK, LOGS)

      expect(getResyncState).toHaveBeenCalledTimes(1)
    })

    it('captures pending historical txs before processing the current block', async () => {
      const historicalEvent = {} as unknown as InteropEvent
      const txToCapture = {
        chain: 'base',
        tx: { hash: '0x123' } as unknown as TxToCapture['tx'],
      } as unknown as TxToCapture
      const txEvent = {} as unknown as InteropEvent
      const historicalCreatorEvent = {} as unknown as InteropEvent
      const historicalCheckedEvent = {} as unknown as InteropEvent
      const txCreatorEvent = {} as unknown as InteropEvent
      const capturePendingHistoricalTxs = vi.fn().mockResolvedValue({
        events: [historicalEvent],
        fulfilledCreatorEvents: [historicalCreatorEvent],
        checkedInHistoryEvents: [historicalCheckedEvent],
      })
      const captureTx = vi.fn().mockReturnValueOnce({
        events: [txEvent],
        fulfilledCreatorEvents: [txCreatorEvent],
      })
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 90n, toBlock: 99n })),
        getItemsToCapture: vi.fn().mockReturnValue({
          logsToCapture: [],
          txsToCapture: [txToCapture],
        }),
        capturePendingHistoricalTxs,
        captureTx,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(capturePendingHistoricalTxs).toHaveBeenCalledWith(100n)
      expect(saveProducedInteropEvents).toHaveBeenCalledWith(
        [historicalEvent, txEvent],
        {
          fromBlock: 90n,
          fromTimestamp: UnixTime(0),
          toBlock: 100n,
          toTimestamp: UnixTime(1_000),
        },
        [historicalCreatorEvent, txCreatorEvent],
        [historicalCheckedEvent],
      )
    })
  })
})

function createSyncer(
  overrides: Partial<InteropEventSyncer> = {},
): InteropEventSyncer {
  return {
    chain: 'ethereum',
    cluster: {
      name: 'mock-cluster',
      plugins: [],
    } as InteropEventSyncer['cluster'],
    store: {
      derivedTxStore: {
        get: vi.fn().mockReturnValue([]),
        getCreatorEvents: vi.fn().mockReturnValue(undefined),
      } as unknown as DerivedTxStore,
    } as unknown as InteropEventStore,
    getResyncState: vi.fn().mockResolvedValue({
      resyncFrom: undefined,
      wipeRequired: false,
    }),
    getLastSyncedRange: vi.fn().mockResolvedValue(undefined),
    getOldestEventForPluginAndChain: vi.fn().mockResolvedValue(undefined),
    getItemsToCapture: vi.fn().mockReturnValue({
      logsToCapture: [],
      txsToCapture: [],
    }),
    captureLog: vi.fn().mockReturnValue(undefined),
    capturePendingHistoricalTxs: vi.fn().mockResolvedValue({
      events: [],
      fulfilledCreatorEvents: [],
      checkedInHistoryEvents: [],
    }),
    captureTx: vi.fn().mockReturnValue(undefined),
    saveProducedInteropEvents: vi.fn().mockResolvedValue(undefined),
    blockProcessingStats: {
      record: vi.fn().mockReturnValue(undefined),
    } as unknown as InteropEventSyncer['blockProcessingStats'],
    ...overrides,
  } as unknown as InteropEventSyncer
}

function makeBlock(number: number, timestamp: UnixTime): Block {
  return {
    number,
    timestamp,
    hash: '0x',
    logsBloom: '0x',
    transactions: [],
  }
}

function makeSyncedRange(
  overrides: Partial<BlockRangeWithTimestamps> = {},
): BlockRangeWithTimestamps {
  return {
    fromBlock: 90n,
    fromTimestamp: UnixTime(0),
    toBlock: 99n,
    toTimestamp: UnixTime(0),
    ...overrides,
  }
}

function makeInteropEventRecord(
  overrides: Partial<InteropEventRecord> = {},
): InteropEventRecord {
  return {
    plugin: 'mock-plugin',
    eventId: 'evt-1',
    type: 'mock-event',
    expiresAt: UnixTime(0),
    timestamp: UnixTime(0),
    chain: 'mock-chain',
    blockNumber: 1,
    args: {},
    ctx: {
      timestamp: UnixTime(0),
      chain: 'mock-chain',
      txHash: '0x',
      logIndex: 0,
    },
    matched: false,
    unsupported: false,
    derivedFulfilled: false,
    derivedCheckedInHistory: false,
    direction: undefined,
    ...overrides,
  }
}
