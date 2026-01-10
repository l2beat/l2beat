import { Logger } from '@l2beat/backend-tools'
import type {
  BlockRangeWithTimestamps,
  InteropEventRecord,
} from '@l2beat/database'
import { UnixTime, type Block, type Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropEvent, LogToCapture } from '../../plugins/types'
import type { InteropEventSyncer } from './InteropEventSyncer'
import { CatchingUpState } from './CatchingUpState'
import { FollowingState } from './FollowingState'

const BLOCK = makeBlock(100, UnixTime(1_000))
const LOGS: Log[] = [mockObject<Log>({})]

describe(FollowingState.name, () => {
  describe(FollowingState.prototype.processNewestBlock.name, () => {
    it('switches to catching up when resync is requested', async () => {
      const getLastSyncedRange = mockFn().resolvesTo(undefined)
      const getItemsToCapture = mockFn().returns({
        logsToCapture: [],
        txsToCapture: [],
      })
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        isResyncRequestedFrom: mockFn().resolvesTo(UnixTime(1)),
        getLastSyncedRange,
        getItemsToCapture,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toBeA(CatchingUpState)
      expect(getLastSyncedRange).not.toHaveBeenCalled()
      expect(getItemsToCapture).not.toHaveBeenCalled()
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('switches to catching up when there is a gap larger than one block', async () => {
      const getItemsToCapture = mockFn().returns({
        logsToCapture: [],
        txsToCapture: [],
      })
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ toBlock: 98n }),
        ),
        getItemsToCapture,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toBeA(CatchingUpState)
      expect(getItemsToCapture).not.toHaveBeenCalled()
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('ignores block when already synced at or past it', async () => {
      const getItemsToCapture = mockFn().returns({
        logsToCapture: [],
        txsToCapture: [],
      })
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ toBlock: 100n }),
        ),
        getItemsToCapture,
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toEqual(state)
      expect(getItemsToCapture).not.toHaveBeenCalled()
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('processes the next block when exactly one behind', async () => {
      const logA = mockObject<LogToCapture>({})
      const logB = mockObject<LogToCapture>({})
      const eventA = mockObject<InteropEvent>({})
      const eventB = mockObject<InteropEvent>({})
      const eventC = mockObject<InteropEvent>({})
      const captureLog = mockFn()
        .returnsOnce([eventA])
        .returnsOnce([eventB, eventC])
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const clearChainSyncError = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ fromBlock: 90n, toBlock: 99n }),
        ),
        getItemsToCapture: mockFn().returns({
          logsToCapture: [logA, logB],
          txsToCapture: [],
        }),
        captureLog,
        saveProducedInteropEvents,
        clearChainSyncError,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      const nextState = await state.processNewestBlock(BLOCK, LOGS)

      expect(nextState).toEqual(state)
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
      )
      expect(clearChainSyncError).toHaveBeenCalled()
    })

    it('bootstraps range from the oldest event when no synced range exists', async () => {
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: mockFn().resolvesTo(undefined),
        getOldestEventForPluginAndChain: mockFn().resolvesTo(
          makeInteropEventRecord({
            blockNumber: 7,
            timestamp: UnixTime(70),
          }),
        ),
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(saveProducedInteropEvents).toHaveBeenCalledWith([], {
        fromBlock: 7n,
        fromTimestamp: UnixTime(70),
        toBlock: 100n,
        toTimestamp: UnixTime(1_000),
      })
    })

    it('bootstraps range from the incoming block when no events exist', async () => {
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: mockFn().resolvesTo(undefined),
        getOldestEventForPluginAndChain: mockFn().resolvesTo(undefined),
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(saveProducedInteropEvents).toHaveBeenCalledWith([], {
        fromBlock: 100n,
        fromTimestamp: UnixTime(1_000),
        toBlock: 100n,
        toTimestamp: UnixTime(1_000),
      })
    })

    it('saves an empty events list when nothing is captured', async () => {
      const logA = mockObject<LogToCapture>({})
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ toBlock: 99n }),
        ),
        getItemsToCapture: mockFn().returns({
          logsToCapture: [logA],
          txsToCapture: [],
        }),
        captureLog: mockFn().returnsOnce(undefined),
        saveProducedInteropEvents,
      })
      const state = new FollowingState(syncer, Logger.SILENT)

      await state.processNewestBlock(BLOCK, LOGS)

      expect(saveProducedInteropEvents).toHaveBeenCalledWith([], {
        fromBlock: 90n,
        fromTimestamp: UnixTime(0),
        toBlock: 100n,
        toTimestamp: UnixTime(1_000),
      })
    })
  })
})

function createSyncer(
  overrides: Partial<InteropEventSyncer> = {},
): InteropEventSyncer {
  return mockObject<InteropEventSyncer>({
    isResyncRequestedFrom: mockFn().resolvesTo(undefined),
    getLastSyncedRange: mockFn().resolvesTo(undefined),
    getOldestEventForPluginAndChain: mockFn().resolvesTo(undefined),
    getItemsToCapture: mockFn().returns({
      logsToCapture: [],
      txsToCapture: [],
    }),
    captureLog: mockFn().returns(undefined),
    saveProducedInteropEvents: mockFn().resolvesTo(undefined),
    clearChainSyncError: mockFn().resolvesTo(undefined),
    ...overrides,
  })
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
    direction: undefined,
    ...overrides,
  }
}
