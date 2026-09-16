import { Logger } from '@l2beat/backend-tools'
import type { InteropPluginName } from '@l2beat/config'
import type {
  BlockRangeWithTimestamps,
  Database,
  InteropEventRecord,
  InteropPluginSyncedRangeRecord,
} from '@l2beat/database'
import type {
  RpcBlock,
  RpcLog,
  RpcReceipt,
  RpcTransaction,
} from '@l2beat/shared'
import {
  type Block,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type {
  DataRequest,
  InteropEvent,
  InteropPluginResyncable,
  LogToCapture,
  TxToCapture,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { toEventSelector } from '../utils'
import type { DerivedTxStore } from './DerivedTxStore'
import { FollowingState } from './FollowingState'
import {
  type BlockProcessorState,
  buildLogQueryForCluster,
  InteropEventSyncer,
  type SyncerState,
  type TimeloopState,
} from './InteropEventSyncer'

describe(InteropEventSyncer.name, () => {
  describe('constructor', () => {
    it('starts in following state', () => {
      const syncer = createSyncer()

      expect(syncer.state).toBeInstanceOf(FollowingState)
      expect(syncer.state.type).toStrictEqual('blockProcessor')
    })
  })

  describe(InteropEventSyncer.prototype.run.name, () => {
    it('runs timeLoop state', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState, run } = makeTimeLoopState()
      syncer.state = timeLoopState

      await syncer.run()

      expect(run).toHaveBeenCalled()
    })

    it('checks status for blockProcessor state', async () => {
      const syncer = createSyncer()
      const {
        state: blockProcessorState,
        checkStatus,
        processNewestBlock,
      } = makeBlockProcessorState()
      syncer.state = blockProcessorState

      await syncer.run()

      expect(checkStatus).toHaveBeenCalled()
      expect(processNewestBlock).not.toHaveBeenCalled()
    })

    it('does not clear errors when checking blockProcessor status', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
            findByPluginNameAndChain: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      })
      const { state: blockProcessorState } = makeBlockProcessorState()
      syncer.state = blockProcessorState

      await syncer.run()

      expect(setLastError).not.toHaveBeenCalled()
    })
  })

  describe(InteropEventSyncer.prototype.processNewestBlock.name, () => {
    it('updates latest block number and runs only for blockProcessor state', async () => {
      const syncer = createSyncer()
      const { state: blockProcessorState, processNewestBlock } =
        makeBlockProcessorState()
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(7), [])

      expect(syncer.latestBlockNumber).toStrictEqual(7n)
      expect(processNewestBlock).toHaveBeenCalled()
    })

    it('updates latest block number but skips when in timeLoop state', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState, run } = makeTimeLoopState()
      syncer.state = timeLoopState

      await syncer.processNewestBlock(makeBlock(9), [])

      expect(syncer.latestBlockNumber).toStrictEqual(9n)
      expect(run).not.toHaveBeenCalled()
    })

    it('updates state when switching to timeLoop state', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState } = makeTimeLoopState()
      const { state: blockProcessorState } =
        makeBlockProcessorState(timeLoopState)
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(5), [])

      expect(syncer.state as SyncerState).toStrictEqual(timeLoopState)
    })
  })

  describe('state execution serialization', () => {
    it('does not wait for active timeLoop work before returning from processNewestBlock', async () => {
      const syncer = createSyncer()
      const pending = deferred<SyncerState>()
      const { state: timeLoopState, run } = makeTimeLoopState()
      run.mockImplementation(async () => await pending.promise)
      syncer.state = timeLoopState

      const runPromise = syncer.run()
      let finished = false
      const blockPromise = syncer
        .processNewestBlock(makeBlock(7), [])
        .then(() => {
          finished = true
        })

      await new Promise<void>((resolve) => setImmediate(resolve))

      expect(finished).toStrictEqual(true)
      expect(syncer.latestBlockNumber).toStrictEqual(7n)

      pending.resolve(timeLoopState)
      await Promise.all([runPromise, blockPromise])
    })

    it('skips timer status checks while block processing is active', async () => {
      const syncer = createSyncer()
      const pending = deferred<SyncerState>()
      const {
        state: blockProcessorState,
        checkStatus,
        processNewestBlock,
      } = makeBlockProcessorState()
      processNewestBlock.mockImplementation(async () => await pending.promise)
      syncer.state = blockProcessorState

      const blockPromise = syncer.processNewestBlock(makeBlock(7), [])

      await syncer.run()

      expect(checkStatus).not.toHaveBeenCalled()
      pending.resolve(blockProcessorState)
      await blockPromise
    })

    it('waits for status checks before processing a block', async () => {
      const syncer = createSyncer()
      const pending = deferred<SyncerState>()
      const {
        state: blockProcessorState,
        checkStatus,
        processNewestBlock,
      } = makeBlockProcessorState()
      checkStatus.mockImplementation(async () => await pending.promise)
      syncer.state = blockProcessorState

      const runPromise = syncer.run()
      const blockPromise = syncer.processNewestBlock(makeBlock(7), [])

      expect(processNewestBlock).not.toHaveBeenCalled()

      pending.resolve(blockProcessorState)
      await Promise.all([runPromise, blockPromise])

      expect(checkStatus).toHaveBeenCalled()
      expect(processNewestBlock).toHaveBeenCalled()
    })

    it('re-reads state after waiting for a status check', async () => {
      const syncer = createSyncer()
      const pending = deferred<SyncerState>()
      const {
        state: blockProcessorState,
        processNewestBlock,
        checkStatus,
      } = makeBlockProcessorState()
      const { state: timeLoopState } = makeTimeLoopState()
      checkStatus.mockImplementation(async () => await pending.promise)
      syncer.state = blockProcessorState

      const runPromise = syncer.run()
      const blockPromise = syncer.processNewestBlock(makeBlock(7), [])

      pending.resolve(timeLoopState)
      await Promise.all([runPromise, blockPromise])

      expect(syncer.state as SyncerState).toStrictEqual(timeLoopState)
      expect(processNewestBlock).not.toHaveBeenCalled()
    })
  })

  describe('state error handling', () => {
    it('stores last error when state throws', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })
      const run = vi.fn().mockImplementation(() => {
        throw new Error('boom')
      })
      const timeLoopState: TimeloopState = {
        type: 'timeLoop',
        name: 'timeLoop',
        status: 'idle',
        run,
      }
      syncer.state = timeLoopState

      await syncer.run()

      expect(setLastError.mock.calls.length).toStrictEqual(1)
      expect(setLastError.mock.calls[0][2]).toContain('boom')
    })

    it('clears a possibly stale stored error once on the first success', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })
      const { state: blockProcessorState } = makeBlockProcessorState()
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(1), [])
      await syncer.processNewestBlock(makeBlock(2), [])
      await syncer.processNewestBlock(makeBlock(3), [])

      expect(setLastError.mock.calls.length).toStrictEqual(1)
      expect(setLastError).toHaveBeenCalledWith('clusterName', 'ethereum', null)
    })

    it('clears the stored error once after recovering from a failure', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })
      const { state: blockProcessorState, processNewestBlock } =
        makeBlockProcessorState()
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(1), []) // clears the stale error
      processNewestBlock.mockImplementationOnce(() => {
        throw new Error('boom')
      })
      await syncer.processNewestBlock(makeBlock(2), [])
      expect(syncer.hasError).toStrictEqual(true)
      await syncer.processNewestBlock(makeBlock(3), [])
      await syncer.processNewestBlock(makeBlock(4), [])

      expect(syncer.hasError).toStrictEqual(false)
      expect(setLastError.mock.calls.map((c) => c[2])).toStrictEqual([
        null,
        expect.stringContaining('boom'),
        null,
      ])
    })

    it('keeps the stored error when a block processor switches to catching up', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })
      const { state: timeLoopState } = makeTimeLoopState()
      const { state: blockProcessorState, processNewestBlock } =
        makeBlockProcessorState(timeLoopState)
      processNewestBlock.mockImplementationOnce(() => {
        throw new Error('boom')
      })
      syncer.state = blockProcessorState

      // the failed block is followed by the next one, which only detects the gap
      await syncer.processNewestBlock(makeBlock(1), [])
      await syncer.processNewestBlock(makeBlock(2), [])

      expect(syncer.state as SyncerState).toStrictEqual(timeLoopState)
      expect(setLastError.mock.calls.length).toStrictEqual(1)
      expect(setLastError.mock.calls[0][2]).toContain('boom')
    })

    it('clears the stored error only once catch-up returns to following', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })
      const { state: blockProcessorState } = makeBlockProcessorState()
      const run = vi.fn<() => Promise<SyncerState>>()
      const timeLoopState: TimeloopState = {
        type: 'timeLoop',
        name: 'catchingUp',
        status: 'idle',
        run,
      }
      run
        .mockResolvedValueOnce(timeLoopState)
        .mockResolvedValue(blockProcessorState)
      syncer.state = timeLoopState

      await syncer.run() // still catching up
      expect(setLastError).not.toHaveBeenCalled()

      await syncer.run() // back to following
      expect(setLastError).toHaveBeenCalledWith('clusterName', 'ethereum', null)
    })

    it('keeps the stored error when a status check succeeds', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })
      const { state: blockProcessorState, processNewestBlock } =
        makeBlockProcessorState()
      processNewestBlock.mockImplementationOnce(() => {
        throw new Error('boom')
      })
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(1), [])
      await syncer.run()

      expect(setLastError.mock.calls.length).toStrictEqual(1)
      expect(setLastError.mock.calls[0][2]).toContain('boom')
    })
  })

  describe(InteropEventSyncer.prototype.captureLog.name, () => {
    it('captures using the only plugin in the cluster', () => {
      const event = makeInteropEventNoPlugin()
      const capture = vi.fn().mockReturnValue([event])
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [makePlugin({ name: 'across', capture })],
        }),
      })

      const result = syncer.captureLog(mockObject<LogToCapture>({}))

      expect(capture).toHaveBeenCalled()
      expect(result).toStrictEqual([{ ...event, plugin: 'across' }])
    })

    it('captures using first plugin in cluster that produces', () => {
      const event = makeInteropEventNoPlugin()
      const firstCapture = vi.fn().mockReturnValue(undefined)
      const secondCapture = vi.fn().mockReturnValue([event])

      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [
            makePlugin({ name: 'across', capture: firstCapture }),
            makePlugin({ name: 'wormhole', capture: secondCapture }),
          ],
        }),
      })

      const result = syncer.captureLog(mockObject<LogToCapture>({}))

      expect(firstCapture).toHaveBeenCalled()
      expect(secondCapture).toHaveBeenCalled()
      expect(result).toStrictEqual([{ ...event, plugin: 'wormhole' }])
    })

    it('returns undefined when no plugin produces', () => {
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [
            makePlugin({
              name: 'across',
              capture: vi.fn().mockReturnValue(undefined),
            }),
          ],
        }),
      })

      const result = syncer.captureLog(mockObject<LogToCapture>({}))

      expect(result).toStrictEqual(undefined)
    })
  })

  describe(InteropEventSyncer.prototype.captureTx.name, () => {
    it('preserves plugin order and passes only plugin-local creator events', () => {
      const event = makeInteropEventNoPlugin()
      const firstCapture = vi.fn().mockReturnValue(undefined)
      const secondCapture = vi.fn().mockReturnValue([event])
      const txToCapture = mockObject<TxToCapture>({
        chain: 'base',
        tx: mockObject<TxToCapture['tx']>({ hash: '0x123' }),
      })
      const creatorEvent = { ...makeInteropEvent(), plugin: 'wormhole' }
      const getCreatorEvents = vi
        .fn()
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([creatorEvent])
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [
            makePlugin({ name: 'across', captureTx: firstCapture }),
            makePlugin({ name: 'wormhole', captureTx: secondCapture }),
          ],
        }),
        store: mockObject<InteropEventStore>({
          derivedTxStore: mockObject<DerivedTxStore>({
            getCreatorEvents,
          }),
        }),
      })

      const result = syncer.captureTx(txToCapture)

      expect(firstCapture).toHaveBeenCalledWith(txToCapture, undefined)
      expect(secondCapture).toHaveBeenCalledWith(txToCapture, [creatorEvent])
      expect(getCreatorEvents).toHaveBeenNthCalledWith(
        1,
        txToCapture.chain,
        txToCapture.tx.hash,
        'across',
      )
      expect(getCreatorEvents).toHaveBeenNthCalledWith(
        2,
        txToCapture.chain,
        txToCapture.tx.hash,
        'wormhole',
      )
      expect(result).toStrictEqual({
        events: [{ ...event, plugin: 'wormhole' }],
        fulfilledCreatorEvents: [creatorEvent],
      })
    })

    it('stops at the first plugin that captures even if a later plugin has creator events', () => {
      const event = makeInteropEventNoPlugin()
      const firstCapture = vi.fn().mockReturnValue([event])
      const secondCapture = vi.fn().mockReturnValue([event])
      const txToCapture = mockObject<TxToCapture>({
        chain: 'base',
        tx: mockObject<TxToCapture['tx']>({ hash: '0x123' }),
      })
      const getCreatorEvents = vi.fn().mockReturnValue(undefined)
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [
            makePlugin({ name: 'across', captureTx: firstCapture }),
            makePlugin({ name: 'wormhole', captureTx: secondCapture }),
          ],
        }),
        store: mockObject<InteropEventStore>({
          derivedTxStore: mockObject<DerivedTxStore>({
            getCreatorEvents,
          }),
        }),
      })

      const result = syncer.captureTx(txToCapture)

      expect(firstCapture).toHaveBeenCalledWith(txToCapture, undefined)
      expect(secondCapture).not.toHaveBeenCalled()
      expect(getCreatorEvents).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual({
        events: [{ ...event, plugin: 'across' }],
        fulfilledCreatorEvents: [],
      })
    })

    it('returns early when no plugin has captureTx', () => {
      const getCreatorEvents = vi.fn().mockReturnValue(undefined)
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [makePlugin({ name: 'across', captureTx: undefined })],
        }),
        store: mockObject<InteropEventStore>({
          derivedTxStore: mockObject<DerivedTxStore>({
            getCreatorEvents,
          }),
        }),
      })

      const result = syncer.captureTx(mockObject<TxToCapture>({}))

      expect(result).toStrictEqual(undefined)
      expect(getCreatorEvents).not.toHaveBeenCalled()
    })
  })

  describe(
    InteropEventSyncer.prototype.capturePendingHistoricalTxs.name,
    () => {
      it('captures pending txs that are older than the current block', async () => {
        const event = makeInteropEventNoPlugin()
        const captureTx = vi.fn().mockReturnValue([event])
        const txHash = '0x123'
        const syncer = createSyncer({
          cluster: makeCluster({
            name: 'clusterName',
            plugins: [makePlugin({ name: 'across', captureTx })],
          }),
          store: mockObject<InteropEventStore>({
            derivedTxStore: mockObject<DerivedTxStore>({
              getHashesPendingHistoryCheck: vi.fn().mockReturnValue([txHash]),
              getCreatorEvents: vi.fn().mockReturnValue([makeInteropEvent()]),
              markCheckedInHistory: vi
                .fn()
                .mockReturnValue([makeInteropEvent()]),
            }),
          }),
          rpcClient: mockObject<InteropEventSyncer['rpcClient']>({
            getTransactionByHash: vi
              .fn()
              .mockResolvedValue(
                makeRpcTransaction({ hash: txHash, blockNumber: 9n }),
              ),
            getTransactionReceipt: vi.fn().mockResolvedValue(makeRpcReceipt()),
            getBlockByNumber: vi.fn().mockResolvedValue(makeRpcBlock(9n)),
          }),
        })

        const result = await syncer.capturePendingHistoricalTxs(10n)

        expect(captureTx).toHaveBeenCalled()
        expect(result).toStrictEqual({
          events: [{ ...event, plugin: 'across' }],
          fulfilledCreatorEvents: [makeInteropEvent()],
          checkedInHistoryEvents: [makeInteropEvent()],
        })
      })

      it('ignores pending txs from the current block or later', async () => {
        const captureTx = vi.fn().mockReturnValue(undefined)
        const getTransactionReceipt = vi
          .fn()
          .mockResolvedValue(makeRpcReceipt())
        const getBlockByNumber = vi.fn().mockResolvedValue(makeRpcBlock(10n))
        const syncer = createSyncer({
          cluster: makeCluster({
            name: 'clusterName',
            plugins: [makePlugin({ name: 'across', captureTx })],
          }),
          store: mockObject<InteropEventStore>({
            derivedTxStore: mockObject<DerivedTxStore>({
              getHashesPendingHistoryCheck: vi.fn().mockReturnValue(['0x123']),
              getCreatorEvents: vi.fn().mockReturnValue([makeInteropEvent()]),
              markCheckedInHistory: vi
                .fn()
                .mockReturnValue([makeInteropEvent()]),
            }),
          }),
          rpcClient: mockObject<InteropEventSyncer['rpcClient']>({
            getTransactionByHash: vi
              .fn()
              .mockResolvedValue(
                makeRpcTransaction({ hash: '0x123', blockNumber: 10n }),
              ),
            getTransactionReceipt,
            getBlockByNumber,
          }),
        })

        const result = await syncer.capturePendingHistoricalTxs(10n)

        expect(result).toStrictEqual({
          events: [],
          fulfilledCreatorEvents: [],
          checkedInHistoryEvents: [makeInteropEvent()],
        })
        expect(captureTx).not.toHaveBeenCalled()
        expect(getTransactionReceipt).not.toHaveBeenCalled()
        expect(getBlockByNumber).not.toHaveBeenCalled()
      })
    },
  )

  describe(InteropEventSyncer.prototype.saveProducedInteropEvents.name, () => {
    it('saves events and updates synced range in a transaction', async () => {
      const saveNewEvents = vi.fn().mockResolvedValue(undefined)
      const updateDerivedFulfilled = vi.fn().mockResolvedValue(undefined)
      const updateDerivedCheckedInHistory = vi.fn().mockResolvedValue(undefined)
      const upsert = vi.fn().mockResolvedValue(undefined)
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const fulfilledCreatorEvent = makeInteropEvent()
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [makePlugin({ name: 'across' })],
        }),
        store: mockObject<InteropEventStore>({
          saveNewEvents,
          updateDerivedFulfilled,
          updateDerivedCheckedInHistory,
        }),
        db: mockObject<Database>({
          interopPluginSyncedRange: mockObject<
            Database['interopPluginSyncedRange']
          >({
            upsert,
          }),
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })

      await syncer.saveProducedInteropEvents(
        [{ ...makeInteropEvent(), plugin: 'cluster' }],
        makeSyncedRange(),
        [fulfilledCreatorEvent],
      )

      expect(syncer.runInTransactionCalls).toStrictEqual(1)
      expect(saveNewEvents).toHaveBeenCalled()
      expect(updateDerivedFulfilled).toHaveBeenCalledWith([
        fulfilledCreatorEvent,
      ])
      expect(updateDerivedCheckedInHistory).toHaveBeenCalledWith([])
      expect(upsert).toHaveBeenCalledWith({
        pluginName: 'clusterName',
        chain: 'ethereum',
        ...makeSyncedRange(),
      })
      expect(setLastError).toHaveBeenCalledWith('clusterName', 'ethereum', null)
    })

    it('writes only the range, outside a transaction, when there is nothing else to write', async () => {
      const saveNewEvents = vi.fn().mockResolvedValue(undefined)
      const upsert = vi.fn().mockResolvedValue(undefined)
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [makePlugin({ name: 'across' })],
        }),
        store: mockObject<InteropEventStore>({
          saveNewEvents,
          updateDerivedFulfilled: vi.fn().mockResolvedValue(undefined),
          updateDerivedCheckedInHistory: vi.fn().mockResolvedValue(undefined),
        }),
        db: mockObject<Database>({
          interopPluginSyncedRange: mockObject<
            Database['interopPluginSyncedRange']
          >({
            upsert,
          }),
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })

      // a stored error may exist after start-up, so the first save clears it
      await syncer.saveProducedInteropEvents([], makeSyncedRange())
      expect(syncer.runInTransactionCalls).toStrictEqual(1)
      expect(setLastError).toHaveBeenCalledWith('clusterName', 'ethereum', null)

      await syncer.saveProducedInteropEvents([], makeSyncedRange())
      await syncer.saveProducedInteropEvents([], makeSyncedRange())

      expect(syncer.runInTransactionCalls).toStrictEqual(1)
      expect(saveNewEvents).toHaveBeenCalledTimes(1)
      expect(setLastError).toHaveBeenCalledTimes(1)
      expect(upsert).toHaveBeenCalledTimes(3)

      // events make it a multi-statement write again
      await syncer.saveProducedInteropEvents(
        [{ ...makeInteropEvent(), plugin: 'cluster' }],
        makeSyncedRange(),
      )
      expect(syncer.runInTransactionCalls).toStrictEqual(2)

      // so does a stored error
      await syncer.saveChainSyncError(new Error('boom'))
      await syncer.saveProducedInteropEvents([], makeSyncedRange())
      expect(syncer.runInTransactionCalls).toStrictEqual(3)
      expect(setLastError.mock.calls.at(-1)?.[2]).toStrictEqual(null)
    })

    it('still considers the error stored when the transaction rolls back after the clear', async () => {
      const setLastError = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [makePlugin({ name: 'across' })],
        }),
        db: mockObject<Database>({
          interopPluginSyncedRange: mockObject<
            Database['interopPluginSyncedRange']
          >({
            upsert: vi.fn().mockResolvedValue(undefined),
          }),
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })

      syncer.failNextCommit = true
      await expect(
        syncer.saveProducedInteropEvents([], makeSyncedRange()),
      ).rejects.toThrow('commit failed')
      expect(setLastError).toHaveBeenCalledTimes(1)

      // the clear was rolled back with the transaction, so it is written again
      await syncer.saveProducedInteropEvents([], makeSyncedRange())
      expect(syncer.runInTransactionCalls).toStrictEqual(2)
      expect(setLastError).toHaveBeenCalledTimes(2)
      expect(setLastError.mock.calls[1][2]).toStrictEqual(null)

      // and only now is it considered cleared
      await syncer.saveProducedInteropEvents([], makeSyncedRange())
      expect(syncer.runInTransactionCalls).toStrictEqual(2)
      expect(setLastError).toHaveBeenCalledTimes(2)
    })
  })

  describe(InteropEventSyncer.prototype.getResyncState.name, () => {
    it('returns empty resync state when no resync requested', async () => {
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            findByPluginNameAndChain: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      })

      const result = await syncer.getResyncState()

      expect(result).toStrictEqual({
        resyncFrom: undefined,
        wipeRequired: false,
      })
    })

    it('returns resync state when present', async () => {
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncState: mockObject<
            Database['interopPluginSyncState']
          >({
            findByPluginNameAndChain: vi.fn().mockResolvedValue({
              resyncRequestedFrom: UnixTime(123),
              wipeRequired: true,
            }),
          }),
        }),
      })

      const result = await syncer.getResyncState()

      expect(result).toStrictEqual({
        resyncFrom: UnixTime(123),
        wipeRequired: true,
      })
    })
  })

  describe(buildLogQueryForCluster.name, () => {
    it('includes only addresses on the target chain and their topics', () => {
      const signature = 'event Transfer(address,address,uint256)'
      const extraSignature = 'event Approval(address,address,uint256)'
      const extraSignatureTwo = 'event Mint(address,uint256)'
      const ethAddress = ChainSpecificAddress.fromLong(
        'ethereum',
        EthereumAddress.random(),
      )
      const arbAddress = ChainSpecificAddress.fromLong(
        'arbitrum',
        EthereumAddress.random(),
      )
      const plugin = makePlugin({
        dataRequests: [
          {
            type: 'event',
            signature,
            includeTxEvents: [extraSignature, extraSignatureTwo],
            includeTx: true,
            addresses: [ethAddress, arbAddress],
          },
        ],
      })

      const query = buildLogQueryForCluster(
        makeCluster({ plugins: [plugin] }),
        'ethereum',
      )

      if (query.addresses === '*') {
        throw new Error('Expected address filter to be a set')
      }
      expect(
        query.addresses.has(ChainSpecificAddress.address(ethAddress)),
      ).toStrictEqual(true)
      expect(Array.from(query.addresses)).toHaveLength(1)
      expect(Array.from(query.topic0s)).toStrictEqual([
        toEventSelector(signature),
      ])
      expect(
        Array.from(query.topicToTxEvents.get(toEventSelector(signature)) ?? []),
      ).toStrictEqual([
        toEventSelector(extraSignature),
        toEventSelector(extraSignatureTwo),
      ])
      expect(query.topic0sWithTx.has(toEventSelector(signature))).toStrictEqual(
        true,
      )
      expect(query.isEmpty()).toStrictEqual(false)
    })

    it('includes topics without address filter when addresses are wildcard', () => {
      const signature = 'event Transfer(address,address,uint256)'
      const plugin = makePlugin({
        dataRequests: [
          {
            type: 'event',
            signature,
            addresses: '*',
          },
        ],
      })

      const query = buildLogQueryForCluster(
        makeCluster({ plugins: [plugin] }),
        'ethereum',
      )

      expect(query.addresses).toStrictEqual('*')
      expect(Array.from(query.topic0s)).toStrictEqual([
        toEventSelector(signature),
      ])
      expect(query.isEmpty()).toStrictEqual(false)
    })

    it('is empty when no addresses match the chain', () => {
      const signature = 'event Transfer(address,address,uint256)'
      const arbAddress = ChainSpecificAddress.fromLong(
        'arbitrum',
        EthereumAddress.random(),
      )
      const plugin = makePlugin({
        dataRequests: [
          {
            type: 'event',
            signature,
            addresses: [arbAddress],
          },
        ],
      })

      const query = buildLogQueryForCluster(
        makeCluster({ plugins: [plugin] }),
        'ethereum',
      )

      if (query.addresses === '*') {
        throw new Error('Expected address filter to be a set')
      }
      expect(query.isEmpty()).toStrictEqual(true)
      expect(Array.from(query.addresses)).toHaveLength(0)
      expect(Array.from(query.topic0s)).toHaveLength(0)
      expect(query.topicToTxEvents.size).toStrictEqual(0)
    })

    it('throws when addresses list is empty', () => {
      const signature = 'event Transfer(address,address,uint256)'
      const plugin = makePlugin({
        dataRequests: [
          {
            type: 'event',
            signature,
            addresses: [],
          },
        ],
      })

      expect(() =>
        buildLogQueryForCluster(makeCluster({ plugins: [plugin] }), 'ethereum'),
      ).toThrow(/Empty address list/)
    })

    it('merges event requests across cluster plugins', () => {
      const signature = 'event Transfer(address,address,uint256)'
      const extraSignatureA = 'event Approval(address,address,uint256)'
      const extraSignatureB = 'event Burn(address,uint256)'
      const ethAddressA = ChainSpecificAddress.fromLong(
        'ethereum',
        EthereumAddress.random(),
      )
      const ethAddressB = ChainSpecificAddress.fromLong(
        'ethereum',
        EthereumAddress.random(),
      )

      const pluginA = makePlugin({
        dataRequests: [
          {
            type: 'event',
            signature,
            includeTxEvents: [extraSignatureA],
            addresses: [ethAddressA],
          },
        ],
      })
      const pluginB = makePlugin({
        dataRequests: [
          {
            type: 'event',
            signature,
            includeTxEvents: [extraSignatureB],
            addresses: [ethAddressB],
          },
        ],
      })

      const query = buildLogQueryForCluster(
        makeCluster({ plugins: [pluginA, pluginB] }),
        'ethereum',
      )

      if (query.addresses === '*') {
        throw new Error('Expected address filter to be a set')
      }
      expect(Array.from(query.addresses)).toStrictEqual([
        ChainSpecificAddress.address(ethAddressA),
        ChainSpecificAddress.address(ethAddressB),
      ])
      expect(Array.from(query.topic0s)).toStrictEqual([
        toEventSelector(signature),
      ])
      expect(
        Array.from(query.topicToTxEvents.get(toEventSelector(signature)) ?? []),
      ).toStrictEqual([
        toEventSelector(extraSignatureA),
        toEventSelector(extraSignatureB),
      ])
    })
  })

  describe('db wrapper methods', () => {
    it('returns last synced range and oldest event', async () => {
      const lastRange = makeSyncedRangeRecord()
      const oldestEvent = makeInteropEventRecord()
      const getOldestEventForPluginAndChain = vi
        .fn()
        .mockResolvedValue(oldestEvent)
      const syncer = createSyncer({
        db: mockObject<Database>({
          interopPluginSyncedRange: mockObject<
            Database['interopPluginSyncedRange']
          >({
            findByPluginNameAndChain: vi.fn().mockResolvedValue(lastRange),
          }),
          interopEvent: mockObject<Database['interopEvent']>({
            getOldestEventForPluginAndChain,
          }),
        }),
      })

      const resultRange = await syncer.getLastSyncedRange()
      const resultEvent = await syncer.getOldestEventForPluginAndChain()

      expect(resultRange).toStrictEqual(lastRange)
      expect(resultEvent).toStrictEqual(oldestEvent)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledTimes(1)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledWith(
        ['across'],
        'ethereum',
      )
    })

    it('returns the oldest event for cluster plugin names', async () => {
      const eventA = makeInteropEventRecord({ timestamp: UnixTime(5) })
      const getOldestEventForPluginAndChain = vi.fn().mockResolvedValue(eventA)

      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [
            makePlugin({ name: 'across' }),
            makePlugin({ name: 'wormhole' }),
          ],
        }),
        db: mockObject<Database>({
          interopEvent: mockObject<Database['interopEvent']>({
            getOldestEventForPluginAndChain,
          }),
        }),
      })

      const resultEvent = await syncer.getOldestEventForPluginAndChain()

      expect(resultEvent).toStrictEqual(eventA)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledTimes(1)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledWith(
        ['across', 'wormhole'],
        'ethereum',
      )
    })
  })

  describe('rpc wrapper methods', () => {
    it('passes through getBlockByNumber, getLogs, getTransactionReceipt, and getTransactionByHash', async () => {
      const getBlockByNumber = vi.fn().mockResolvedValue(makeRpcBlock(5n))
      const log = makeRpcLog()
      const getLogs = vi.fn().mockResolvedValue([log])
      const receipt = makeRpcReceipt()
      const getTransactionReceipt = vi.fn().mockResolvedValue(receipt)
      const transaction = makeRpcTransaction()
      const getTransactionByHash = vi.fn().mockResolvedValue(transaction)
      const syncer = createSyncer({
        rpcClient: mockObject<InteropEventSyncer['rpcClient']>({
          getBlockByNumber,
          getLogs,
          getTransactionReceipt,
          getTransactionByHash,
        }),
      })

      const block = await syncer.getBlockByNumber(5n)
      const logs = await syncer.getLogs({
        fromBlock: 1n,
        toBlock: 2n,
        address: [],
        topics: [[]],
      })
      const txReceipt = await syncer.getTransactionReceipt(ZERO_HASH)
      const tx = await syncer.getTransactionByHash(ZERO_HASH)

      expect(block).toStrictEqual(makeRpcBlock(5n))
      expect(logs).toStrictEqual([log])
      expect(txReceipt).toStrictEqual(receipt)
      expect(tx).toStrictEqual(transaction)
    })
  })
})

class TestSyncer extends InteropEventSyncer {
  runInTransactionCalls = 0
  /** Runs the callback, then fails the transaction as if COMMIT had failed. */
  failNextCommit = false

  public triggerStatePublic<T extends SyncerState>(
    state: T,
    fn: (state: T) => Promise<SyncerState>,
  ) {
    return this.triggerState(state, fn)
  }

  protected override async runInTransaction<T>(
    fn: () => Promise<T>,
  ): Promise<T> {
    this.runInTransactionCalls++
    const result = await fn()
    if (this.failNextCommit) {
      this.failNextCommit = false
      throw new Error('commit failed')
    }
    return result
  }
}

function createSyncer(overrides: Partial<TestSyncer> = {}) {
  const { chain, cluster, rpcClient, store, db, ...rest } = overrides
  const syncer = new TestSyncer(
    chain ?? 'ethereum',
    cluster ?? makeCluster({ name: 'clusterName', plugins: [makePlugin()] }),
    rpcClient ?? mockRpcClient(),
    store ?? mockStore(),
    db ?? mockDb(),
    Logger.SILENT,
  )
  Object.assign(syncer, rest)
  return syncer
}

function makeCluster(
  params: { name?: string; plugins?: InteropPluginResyncable[] } = {},
): InteropEventSyncer['cluster'] {
  return {
    name: params.name ?? 'clusterName',
    plugins: params.plugins ?? [makePlugin()],
  }
}

function makePlugin(
  params: {
    name?: InteropPluginName
    dataRequests?: DataRequest[]
    capture?: (
      input: LogToCapture,
    ) => Omit<InteropEvent, 'plugin'>[] | undefined
    captureTx?: (
      input: TxToCapture,
      creatorEvents?: InteropEvent[],
    ) => Omit<InteropEvent, 'plugin'>[] | undefined
  } = {},
): InteropPluginResyncable {
  return {
    name: params.name ?? 'across',
    capture: params.capture ?? vi.fn().mockReturnValue(undefined),
    captureTx: params.captureTx,
    getDataRequests: () => params.dataRequests ?? [],
  }
}

function makeTimeLoopState(): {
  state: TimeloopState
  run: ReturnType<typeof vi.fn>
} {
  const run = vi.fn<() => Promise<SyncerState>>()
  const state: TimeloopState = {
    type: 'timeLoop',
    name: 'timeLoop',
    status: 'idle',
    run,
  }
  run.mockResolvedValue(state)
  return { state, run }
}

function makeBlockProcessorState(resultState?: SyncerState): {
  state: BlockProcessorState
  checkStatus: ReturnType<typeof vi.fn>
  processNewestBlock: ReturnType<typeof vi.fn>
} {
  const checkStatus = vi.fn<() => Promise<SyncerState>>()
  const processNewestBlock = vi.fn<() => Promise<SyncerState>>()
  const state: BlockProcessorState = {
    type: 'blockProcessor',
    name: 'blockProcessor',
    status: 'idle',
    checkStatus,
    processNewestBlock,
  }
  checkStatus.mockResolvedValue(resultState ?? state)
  processNewestBlock.mockResolvedValue(resultState ?? state)
  return { state, checkStatus, processNewestBlock }
}

function makeBlock(number: number): Block {
  return {
    number,
    timestamp: number,
    hash: '0x',
    logsBloom: '0x',
    transactions: [],
  }
}

function makeSyncedRange(
  overrides: Partial<BlockRangeWithTimestamps> = {},
): BlockRangeWithTimestamps {
  return {
    fromBlock: 1n,
    fromTimestamp: UnixTime(1),
    toBlock: 2n,
    toTimestamp: UnixTime(2),
    ...overrides,
  }
}

function makeSyncedRangeRecord(
  overrides: Partial<InteropPluginSyncedRangeRecord> = {},
): InteropPluginSyncedRangeRecord {
  return {
    pluginName: 'base',
    chain: 'ethereum',
    ...makeSyncedRange(),
    ...overrides,
  }
}

function makeInteropEvent(): InteropEvent {
  return {
    plugin: 'base',
    eventId: 'evt-1',
    type: 'mock.event',
    expiresAt: UnixTime(0),
    ctx: {
      chain: 'ethereum',
      logIndex: 0,
      timestamp: UnixTime(0),
      txHash: '0x',
    },
    args: {},
  }
}

function makeInteropEventNoPlugin(): Omit<InteropEvent, 'plugin'> {
  const event = makeInteropEvent()
  const { plugin: _plugin, ...rest } = event
  return rest
}

function makeInteropEventRecord(
  overrides: Partial<InteropEventRecord> = {},
): InteropEventRecord {
  return {
    plugin: 'base',
    eventId: 'evt-1',
    type: 'mock.event',
    expiresAt: UnixTime(0),
    timestamp: UnixTime(0),
    chain: 'ethereum',
    blockNumber: 1,
    args: {},
    ctx: {
      timestamp: UnixTime(0),
      chain: 'ethereum',
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

function makeRpcBlock(number: bigint): RpcBlock {
  return {
    number,
    timestamp: number,
    hash: ZERO_HASH,
    logsBloom: `0x${'00'.repeat(256)}`,
  } as RpcBlock
}

function makeRpcLog(): RpcLog {
  return {
    address: EthereumAddress.random(),
    data: '0x',
    topics: [],
    logIndex: 0n,
    transactionIndex: 0n,
    transactionHash: ZERO_HASH,
    blockNumber: 1n,
    blockTimestamp: 1n,
    blockHash: ZERO_HASH,
  }
}

function makeRpcReceipt(): RpcReceipt {
  return {
    transactionHash: ZERO_HASH,
    transactionIndex: 0n,
    blockHash: ZERO_HASH,
    blockNumber: 1n,
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
    cumulativeGasUsed: 0n,
    gasUsed: 0n,
    contractAddress: null,
    logs: [],
    logsBloom: `0x${'00'.repeat(256)}`,
    type: 0n,
  }
}

function makeRpcTransaction(
  overrides: Partial<RpcTransaction> = {},
): RpcTransaction {
  return {
    type: 1n,
    blockHash: ZERO_HASH,
    blockNumber: 1n,
    from: EthereumAddress.random(),
    gas: 0n,
    hash: ZERO_HASH,
    input: '0x',
    to: EthereumAddress.random(),
    transactionIndex: 0n,
    value: 0n,
    ...overrides,
  }
}

function mockRpcClient(): InteropEventSyncer['rpcClient'] {
  return mockObject<InteropEventSyncer['rpcClient']>({
    getBlockByNumber: vi.fn().mockResolvedValue(makeRpcBlock(1n)),
    getLogs: vi.fn().mockResolvedValue([]),
    getTransactionReceipt: vi.fn().mockResolvedValue(null),
    getTransactionByHash: vi.fn().mockResolvedValue(null),
  })
}

function mockStore() {
  return mockObject<InteropEventStore>({
    saveNewEvents: vi.fn().mockResolvedValue(undefined),
    updateDerivedFulfilled: vi.fn().mockResolvedValue(undefined),
    updateDerivedCheckedInHistory: vi.fn().mockResolvedValue(undefined),
    deleteAllForPlugin: vi.fn().mockResolvedValue(undefined),
    derivedTxStore: mockObject<DerivedTxStore>({
      getCreatorEvents: vi.fn().mockReturnValue(undefined),
      getHashesPendingHistoryCheck: vi.fn().mockReturnValue([]),
      markCheckedInHistory: vi.fn().mockReturnValue([]),
    }),
  })
}

function mockDb(): Database {
  return mockObject<Database>({
    transaction: vi.fn().mockImplementation(async (cb) => await cb()),
    interopPluginSyncedRange: mockObject<Database['interopPluginSyncedRange']>({
      findByPluginNameAndChain: vi
        .fn()
        .mockResolvedValue(makeSyncedRangeRecord()),
      upsert: vi.fn().mockResolvedValue(undefined),
    }),
    interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
      setLastError: vi.fn().mockResolvedValue(undefined),
      findByPluginNameAndChain: vi.fn().mockResolvedValue(undefined),
    }),
    interopEvent: mockObject<Database['interopEvent']>({
      getOldestEventForPluginAndChain: vi
        .fn()
        .mockResolvedValue(makeInteropEventRecord()),
    }),
    interopMessage: mockObject<Database['interopMessage']>({
      deleteForPlugin: vi.fn().mockResolvedValue(undefined),
    }),
    interopTransfer: mockObject<Database['interopTransfer']>({
      deleteForPlugin: vi.fn().mockResolvedValue(undefined),
    }),
  })
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const ZERO_HASH = `0x${'00'.repeat(32)}`
