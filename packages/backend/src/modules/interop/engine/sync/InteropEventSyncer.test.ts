import { Logger } from '@l2beat/backend-tools'
import type { InteropPluginName } from '@l2beat/config'
import type {
  BlockRangeWithTimestamps,
  InteropEventRecord,
  InteropPluginSyncedRangeRecord,
} from '@l2beat/database'
import type { RpcBlock, RpcLog } from '@l2beat/shared'
import {
  type Block,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  createEventParser,
  type DataRequest,
  type InteropEvent,
  type InteropPluginResyncable,
  type LogToCapture,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { toEventSelector } from '../utils'
import { FollowingState } from './FollowingState'
import {
  type BlockProcessorState,
  buildLogQueryForPlugin,
  InteropEventSyncer,
  type SyncerState,
  type TimeloopState,
} from './InteropEventSyncer'

describe(InteropEventSyncer.name, () => {
  describe('constructor', () => {
    it('starts in following state', () => {
      const syncer = createSyncer()

      expect(syncer.state).toBeA(FollowingState)
      expect(syncer.state.type).toEqual('blockProcessor')
    })
  })

  describe(InteropEventSyncer.prototype.run.name, () => {
    it('runs only for timeLoop state and unpauses', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState, run } = makeTimeLoopState()
      syncer.state = timeLoopState

      await syncer.run()

      expect(run).toHaveBeenCalled()
      expect(syncer.unpauseCalls).toEqual(1)
    })

    it('does nothing for blockProcessor state', async () => {
      const syncer = createSyncer()
      const { state: blockProcessorState, processNewestBlock } =
        makeBlockProcessorState()
      syncer.state = blockProcessorState

      await syncer.run()

      expect(processNewestBlock).not.toHaveBeenCalled()
      expect(syncer.pauseCalls).toEqual(0)
      expect(syncer.unpauseCalls).toEqual(0)
    })
  })

  describe(InteropEventSyncer.prototype.processNewestBlock.name, () => {
    it('updates latest block number and runs only for blockProcessor state', async () => {
      const syncer = createSyncer()
      const { state: blockProcessorState, processNewestBlock } =
        makeBlockProcessorState()
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(7), [])

      expect(syncer.latestBlockNumber).toEqual(7n)
      expect(processNewestBlock).toHaveBeenCalled()
      expect(syncer.pauseCalls).toEqual(1)
    })

    it('updates latest block number but skips when in timeLoop state', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState, run } = makeTimeLoopState()
      syncer.state = timeLoopState

      await syncer.processNewestBlock(makeBlock(9), [])

      expect(syncer.latestBlockNumber).toEqual(9n)
      expect(run).not.toHaveBeenCalled()
      expect(syncer.pauseCalls).toEqual(0)
      expect(syncer.unpauseCalls).toEqual(0)
    })

    it('unpauses when switching to timeLoop state', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState } = makeTimeLoopState()
      const { state: blockProcessorState } =
        makeBlockProcessorState(timeLoopState)
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(5), [])

      expect(syncer.unpauseCalls).toEqual(1)
      expect(syncer.state as SyncerState).toEqual(timeLoopState)
    })
  })

  describe('state error handling', () => {
    it('stores last error when state throws', async () => {
      const setLastError = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })
      const run = mockFn().throws(new Error('boom'))
      const timeLoopState: TimeloopState = {
        type: 'timeLoop',
        name: 'timeLoop',
        status: 'idle',
        run,
      }
      syncer.state = timeLoopState

      await syncer.run()

      expect(setLastError.calls.length).toEqual(2)
      expect(setLastError.calls[0]?.args[2]).toEqual(null)
      expect(setLastError.calls[1]?.args[2]).toInclude('boom')
    })
  })

  describe(InteropEventSyncer.prototype.captureLog.name, () => {
    it('captures using the primary plugin when not clustered', () => {
      const event = makeInteropEventNoPlugin()
      const capture = mockFn().returns([event])
      const syncer = createSyncer({
        plugin: makePlugin({ name: 'base', capture }),
        clusterPlugins: [],
      })

      const result = syncer.captureLog(mockObject<LogToCapture>({}))

      expect(capture).toHaveBeenCalled()
      expect(result).toEqual([
        { ...event, plugin: 'base' as InteropPluginName },
      ])
    })

    it('captures using first plugin in cluster that produces', () => {
      const event = makeInteropEventNoPlugin()
      const firstCapture = mockFn().returns(undefined)
      const secondCapture = mockFn().returns([event])

      const syncer = createSyncer({
        plugin: makePlugin({ name: 'base', capture: mockFn() }),
        clusterPlugins: [
          makePlugin({ name: 'first', capture: firstCapture }),
          makePlugin({ name: 'second', capture: secondCapture }),
        ],
      })

      const result = syncer.captureLog(mockObject<LogToCapture>({}))

      expect(firstCapture).toHaveBeenCalled()
      expect(secondCapture).toHaveBeenCalled()
      expect(result).toEqual([
        { ...event, plugin: 'base' as InteropPluginName },
      ])
    })

    it('returns undefined when no plugin produces', () => {
      const syncer = createSyncer({
        clusterPlugins: [
          makePlugin({ name: 'x', capture: mockFn().returns(undefined) }),
        ],
      })

      const result = syncer.captureLog(mockObject<LogToCapture>({}))

      expect(result).toEqual(undefined)
    })
  })

  describe(InteropEventSyncer.prototype.saveProducedInteropEvents.name, () => {
    it('saves events and updates synced range in a transaction', async () => {
      const saveNewEvents = mockFn().resolvesTo(undefined)
      const upsert = mockFn().resolvesTo(undefined)
      const setLastError = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        store: mockObject<InteropEventStore>({ saveNewEvents }),
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncedRange: mockObject<
            InteropEventSyncer['db']['interopPluginSyncedRange']
          >({
            upsert,
          }),
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            setLastError,
          }),
        }),
      })

      await syncer.saveProducedInteropEvents(
        [makeInteropEvent()],
        makeSyncedRange(),
      )

      expect(syncer.runInTransactionCalls).toEqual(1)
      expect(saveNewEvents).toHaveBeenCalled()
      expect(upsert).toHaveBeenCalledWith({
        pluginName: 'base',
        chain: 'ethereum',
        ...makeSyncedRange(),
      })
      expect(setLastError).toHaveBeenCalledWith('base', 'ethereum', null)
    })
  })

  describe(InteropEventSyncer.prototype.isResyncRequestedFrom.name, () => {
    it('returns undefined when no resync requested', async () => {
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            findByPluginNameAndChain: mockFn().resolvesTo(undefined),
          }),
        }),
      })

      const result = await syncer.isResyncRequestedFrom()

      expect(result).toEqual(undefined)
    })

    it('returns resync timestamp when present', async () => {
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            findByPluginNameAndChain: mockFn().resolvesTo({
              resyncRequestedFrom: UnixTime(123),
            }),
          }),
        }),
      })

      const result = await syncer.isResyncRequestedFrom()

      expect(result).toEqual(UnixTime(123))
    })
  })

  describe(buildLogQueryForPlugin.name, () => {
    it('includes only addresses on the target chain and their topics', () => {
      const signature = 'event Transfer(address,address,uint256)'
      const parser = createEventParser(signature)
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
            signature: parser,
            addresses: [ethAddress, arbAddress],
            captureFn: (_log) => {},
          },
        ],
      })

      const query = buildLogQueryForPlugin(plugin, 'ethereum')

      expect(
        query.addresses.has(ChainSpecificAddress.address(ethAddress)),
      ).toEqual(true)
      expect(Array.from(query.addresses)).toHaveLength(1)
      expect(Array.from(query.topic0s)).toEqual([toEventSelector(signature)])
      expect(query.isEmpty()).toEqual(false)
    })

    it('is empty when no addresses match the chain', () => {
      const signature = 'event Transfer(address,address,uint256)'
      const parser = createEventParser(signature)
      const arbAddress = ChainSpecificAddress.fromLong(
        'arbitrum',
        EthereumAddress.random(),
      )
      const plugin = makePlugin({
        dataRequests: [
          {
            type: 'event',
            signature: parser,
            addresses: [arbAddress],
            captureFn: (_log) => {},
          },
        ],
      })

      const query = buildLogQueryForPlugin(plugin, 'ethereum')

      expect(query.isEmpty()).toEqual(true)
      expect(Array.from(query.addresses)).toHaveLength(0)
      expect(Array.from(query.topic0s)).toHaveLength(0)
    })
  })

  describe(InteropEventSyncer.prototype.deleteAllClusterData.name, () => {
    it('wipes data for cluster plugins when present', async () => {
      const deleteMessage = mockFn().resolvesTo(undefined)
      const deleteTransfer = mockFn().resolvesTo(undefined)
      const deleteEvents = mockFn().resolvesTo(undefined)
      const transaction = mockFn().executes(async (cb) => await cb())
      const syncer = createSyncer({
        plugin: makePlugin({ name: 'base' as InteropPluginName }),
        clusterPlugins: [makePlugin({ name: 'a' }), makePlugin({ name: 'b' })],
        db: mockObject<InteropEventSyncer['db']>({
          transaction,
          interopMessage: mockObject<
            InteropEventSyncer['db']['interopMessage']
          >({ deleteForPlugin: deleteMessage }),
          interopTransfer: mockObject<
            InteropEventSyncer['db']['interopTransfer']
          >({ deleteForPlugin: deleteTransfer }),
        }),
        store: mockObject<InteropEventStore>({
          deleteAllForPlugin: deleteEvents,
        }),
      })

      await syncer.deleteAllClusterData()

      expect(transaction).toHaveBeenCalled()
      expect(deleteMessage).toHaveBeenCalledTimes(2)
      expect(deleteTransfer).toHaveBeenCalledTimes(2)
      expect(deleteEvents).toHaveBeenCalledTimes(2)
    })

    it('wipes data for the main plugin when no cluster', async () => {
      const deleteMessage = mockFn().resolvesTo(undefined)
      const deleteTransfer = mockFn().resolvesTo(undefined)
      const deleteEvents = mockFn().resolvesTo(undefined)
      const transaction = mockFn().executes(async (cb) => await cb())
      const syncer = createSyncer({
        plugin: makePlugin({ name: 'base' as InteropPluginName }),
        clusterPlugins: [],
        db: mockObject<InteropEventSyncer['db']>({
          transaction,
          interopMessage: mockObject<
            InteropEventSyncer['db']['interopMessage']
          >({ deleteForPlugin: deleteMessage }),
          interopTransfer: mockObject<
            InteropEventSyncer['db']['interopTransfer']
          >({ deleteForPlugin: deleteTransfer }),
        }),
        store: mockObject<InteropEventStore>({
          deleteAllForPlugin: deleteEvents,
        }),
      })

      await syncer.deleteAllClusterData()

      expect(deleteMessage).toHaveBeenCalledTimes(1)
      expect(deleteTransfer).toHaveBeenCalledTimes(1)
      expect(deleteEvents).toHaveBeenCalledTimes(1)
    })
  })

  describe('db wrapper methods', () => {
    it('returns last synced range and oldest event', async () => {
      const lastRange = makeSyncedRangeRecord()
      const oldestEvent = makeInteropEventRecord()
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncedRange: mockObject<
            InteropEventSyncer['db']['interopPluginSyncedRange']
          >({
            findByPluginNameAndChain: mockFn().resolvesTo(lastRange),
          }),
          interopEvent: mockObject<InteropEventSyncer['db']['interopEvent']>({
            getOldestEventForPluginAndChain: mockFn().resolvesTo(oldestEvent),
          }),
        }),
      })

      const resultRange = await syncer.getLastSyncedRange()
      const resultEvent = await syncer.getOldestEventForPluginAndChain()

      expect(resultRange).toEqual(lastRange)
      expect(resultEvent).toEqual(oldestEvent)
    })
  })

  describe('rpc wrapper methods', () => {
    it('passes through getBlockByNumber and getLogs', async () => {
      const getBlockByNumber = mockFn().resolvesTo(makeRpcBlock(5n))
      const log = makeRpcLog()
      const getLogs = mockFn().resolvesTo([log])
      const syncer = createSyncer({
        rpcClient: mockObject<InteropEventSyncer['rpcClient']>({
          getBlockByNumber,
          getLogs,
        }),
      })

      const block = await syncer.getBlockByNumber(5n)
      const logs = await syncer.getLogs({
        fromBlock: 1n,
        toBlock: 2n,
        address: [],
        topics: [[]],
      })

      expect(block).toEqual(makeRpcBlock(5n))
      expect(logs).toEqual([log])
    })
  })
})

class TestSyncer extends InteropEventSyncer {
  pauseCalls = 0
  unpauseCalls = 0
  runInTransactionCalls = 0

  public triggerStatePublic<T extends SyncerState>(
    state: T,
    fn: (state: T) => Promise<SyncerState>,
  ) {
    return this.triggerState(state, fn)
  }

  override pause() {
    this.pauseCalls++
  }

  override unpause() {
    this.unpauseCalls++
    return undefined
  }

  protected override async runInTransaction<T>(
    fn: () => Promise<T>,
  ): Promise<T> {
    this.runInTransactionCalls++
    return await fn()
  }
}

function createSyncer(overrides: Partial<TestSyncer> = {}) {
  const plugin = makePlugin({ name: 'base' as InteropPluginName })
  const syncer = new TestSyncer(
    'ethereum',
    plugin,
    [],
    mockRpcClient(),
    mockStore(),
    mockDb(),
    Logger.SILENT,
  )
  Object.assign(syncer, overrides)
  return syncer
}

function makePlugin(
  params: {
    name?: string
    dataRequests?: DataRequest[]
    capture?: (
      input: LogToCapture,
    ) => Omit<InteropEvent, 'plugin'>[] | undefined
  } = {},
): InteropPluginResyncable {
  return {
    name: (params.name as InteropPluginName) ?? ('plugin' as InteropPluginName),
    capture: params.capture ?? mockFn().returns(undefined),
    getDataRequests: () => params.dataRequests ?? [],
  }
}

function makeTimeLoopState(): {
  state: TimeloopState
  run: ReturnType<typeof mockFn>
} {
  const run = mockFn<[], Promise<SyncerState>>()
  const state: TimeloopState = {
    type: 'timeLoop',
    name: 'timeLoop',
    status: 'idle',
    run,
  }
  run.resolvesTo(state)
  return { state, run }
}

function makeBlockProcessorState(resultState?: SyncerState): {
  state: BlockProcessorState
  processNewestBlock: ReturnType<typeof mockFn>
} {
  const processNewestBlock = mockFn<[], Promise<SyncerState>>()
  const state: BlockProcessorState = {
    type: 'blockProcessor',
    name: 'blockProcessor',
    status: 'idle',
    processNewestBlock,
  }
  processNewestBlock.resolvesTo(resultState ?? state)
  return { state, processNewestBlock }
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
    direction: undefined,
    ...overrides,
  }
}

function makeRpcBlock(number: bigint): RpcBlock {
  return {
    number,
    timestamp: number,
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

function mockRpcClient(): InteropEventSyncer['rpcClient'] {
  return mockObject<InteropEventSyncer['rpcClient']>({
    getBlockByNumber: mockFn().resolvesTo(makeRpcBlock(1n)),
    getLogs: mockFn().resolvesTo([]),
  })
}

function mockStore() {
  return mockObject<InteropEventStore>({
    saveNewEvents: mockFn().resolvesTo(undefined),
    deleteAllForPlugin: mockFn().resolvesTo(undefined),
  })
}

function mockDb(): InteropEventSyncer['db'] {
  return mockObject<InteropEventSyncer['db']>({
    transaction: mockFn().executes(async (cb) => await cb()),
    interopPluginSyncedRange: mockObject<
      InteropEventSyncer['db']['interopPluginSyncedRange']
    >({
      findByPluginNameAndChain: mockFn().resolvesTo(makeSyncedRangeRecord()),
      upsert: mockFn().resolvesTo(undefined),
    }),
    interopPluginSyncState: mockObject<
      InteropEventSyncer['db']['interopPluginSyncState']
    >({
      setLastError: mockFn().resolvesTo(undefined),
      findByPluginNameAndChain: mockFn().resolvesTo(undefined),
    }),
    interopEvent: mockObject<InteropEventSyncer['db']['interopEvent']>({
      getOldestEventForPluginAndChain: mockFn().resolvesTo(
        makeInteropEventRecord(),
      ),
    }),
    interopMessage: mockObject<InteropEventSyncer['db']['interopMessage']>({
      deleteForPlugin: mockFn().resolvesTo(undefined),
    }),
    interopTransfer: mockObject<InteropEventSyncer['db']['interopTransfer']>({
      deleteForPlugin: mockFn().resolvesTo(undefined),
    }),
  })
}

const ZERO_HASH = `0x${'00'.repeat(32)}`
