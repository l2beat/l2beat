import { Logger } from '@l2beat/backend-tools'
import type { InteropPluginName } from '@l2beat/config'
import type {
  BlockRangeWithTimestamps,
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
import { expect, mockFn, mockObject } from 'earl'
import type {
  DataRequest,
  InteropEvent,
  InteropPluginResyncable,
  LogToCapture,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { toEventSelector } from '../utils'
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

      expect(syncer.state).toBeA(FollowingState)
      expect(syncer.state.type).toEqual('blockProcessor')
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
      const setLastError = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            setLastError,
            findByPluginNameAndChain: mockFn().resolvesTo(undefined),
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

      expect(syncer.latestBlockNumber).toEqual(7n)
      expect(processNewestBlock).toHaveBeenCalled()
    })

    it('updates latest block number but skips when in timeLoop state', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState, run } = makeTimeLoopState()
      syncer.state = timeLoopState

      await syncer.processNewestBlock(makeBlock(9), [])

      expect(syncer.latestBlockNumber).toEqual(9n)
      expect(run).not.toHaveBeenCalled()
    })

    it('updates state when switching to timeLoop state', async () => {
      const syncer = createSyncer()
      const { state: timeLoopState } = makeTimeLoopState()
      const { state: blockProcessorState } =
        makeBlockProcessorState(timeLoopState)
      syncer.state = blockProcessorState

      await syncer.processNewestBlock(makeBlock(5), [])

      expect(syncer.state as SyncerState).toEqual(timeLoopState)
    })
  })

  describe('state execution serialization', () => {
    it('does not wait for active timeLoop work before returning from processNewestBlock', async () => {
      const syncer = createSyncer()
      const pending = deferred<SyncerState>()
      const { state: timeLoopState, run } = makeTimeLoopState()
      run.executes(async () => await pending.promise)
      syncer.state = timeLoopState

      const runPromise = syncer.run()
      let finished = false
      const blockPromise = syncer
        .processNewestBlock(makeBlock(7), [])
        .then(() => {
          finished = true
        })

      await new Promise<void>((resolve) => setImmediate(resolve))

      expect(finished).toEqual(true)
      expect(syncer.latestBlockNumber).toEqual(7n)

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
      processNewestBlock.executes(async () => await pending.promise)
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
      checkStatus.executes(async () => await pending.promise)
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
      checkStatus.executes(async () => await pending.promise)
      syncer.state = blockProcessorState

      const runPromise = syncer.run()
      const blockPromise = syncer.processNewestBlock(makeBlock(7), [])

      pending.resolve(timeLoopState)
      await Promise.all([runPromise, blockPromise])

      expect(syncer.state as SyncerState).toEqual(timeLoopState)
      expect(processNewestBlock).not.toHaveBeenCalled()
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
    it('captures using the only plugin in the cluster', () => {
      const event = makeInteropEventNoPlugin()
      const capture = mockFn().returns([event])
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [makePlugin({ name: 'across', capture })],
        }),
      })

      const result = syncer.captureLog(mockObject<LogToCapture>({}))

      expect(capture).toHaveBeenCalled()
      expect(result).toEqual([{ ...event, plugin: 'across' }])
    })

    it('captures using first plugin in cluster that produces', () => {
      const event = makeInteropEventNoPlugin()
      const firstCapture = mockFn().returns(undefined)
      const secondCapture = mockFn().returns([event])

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
      expect(result).toEqual([{ ...event, plugin: 'wormhole' }])
    })

    it('returns undefined when no plugin produces', () => {
      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [
            makePlugin({
              name: 'across',
              capture: mockFn().returns(undefined),
            }),
          ],
        }),
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
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [makePlugin({ name: 'across' })],
        }),
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
        [{ ...makeInteropEvent(), plugin: 'cluster' }],
        makeSyncedRange(),
      )

      expect(syncer.runInTransactionCalls).toEqual(1)
      expect(saveNewEvents).toHaveBeenCalled()
      expect(upsert).toHaveBeenCalledWith({
        pluginName: 'clusterName',
        chain: 'ethereum',
        ...makeSyncedRange(),
      })
      expect(setLastError).toHaveBeenCalledWith('clusterName', 'ethereum', null)
    })
  })

  describe(InteropEventSyncer.prototype.getResyncState.name, () => {
    it('returns empty resync state when no resync requested', async () => {
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            findByPluginNameAndChain: mockFn().resolvesTo(undefined),
          }),
        }),
      })

      const result = await syncer.getResyncState()

      expect(result).toEqual({
        resyncFrom: undefined,
        wipeRequired: false,
      })
    })

    it('returns resync state when present', async () => {
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            findByPluginNameAndChain: mockFn().resolvesTo({
              resyncRequestedFrom: UnixTime(123),
              wipeRequired: true,
            }),
          }),
        }),
      })

      const result = await syncer.getResyncState()

      expect(result).toEqual({
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
      ).toEqual(true)
      expect(Array.from(query.addresses)).toHaveLength(1)
      expect(Array.from(query.topic0s)).toEqual([toEventSelector(signature)])
      expect(
        Array.from(query.topicToTxEvents.get(toEventSelector(signature)) ?? []),
      ).toEqual([
        toEventSelector(extraSignature),
        toEventSelector(extraSignatureTwo),
      ])
      expect(query.topic0sWithTx.has(toEventSelector(signature))).toEqual(true)
      expect(query.isEmpty()).toEqual(false)
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

      expect(query.addresses).toEqual('*')
      expect(Array.from(query.topic0s)).toEqual([toEventSelector(signature)])
      expect(query.isEmpty()).toEqual(false)
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
      expect(query.isEmpty()).toEqual(true)
      expect(Array.from(query.addresses)).toHaveLength(0)
      expect(Array.from(query.topic0s)).toHaveLength(0)
      expect(query.topicToTxEvents.size).toEqual(0)
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
      expect(Array.from(query.addresses)).toEqual([
        ChainSpecificAddress.address(ethAddressA),
        ChainSpecificAddress.address(ethAddressB),
      ])
      expect(Array.from(query.topic0s)).toEqual([toEventSelector(signature)])
      expect(
        Array.from(query.topicToTxEvents.get(toEventSelector(signature)) ?? []),
      ).toEqual([
        toEventSelector(extraSignatureA),
        toEventSelector(extraSignatureB),
      ])
    })
  })

  describe('db wrapper methods', () => {
    it('returns last synced range and oldest event', async () => {
      const lastRange = makeSyncedRangeRecord()
      const oldestEvent = makeInteropEventRecord()
      const getOldestEventForPluginAndChain = mockFn().resolvesTo(oldestEvent)
      const syncer = createSyncer({
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncedRange: mockObject<
            InteropEventSyncer['db']['interopPluginSyncedRange']
          >({
            findByPluginNameAndChain: mockFn().resolvesTo(lastRange),
          }),
          interopEvent: mockObject<InteropEventSyncer['db']['interopEvent']>({
            getOldestEventForPluginAndChain,
          }),
        }),
      })

      const resultRange = await syncer.getLastSyncedRange()
      const resultEvent = await syncer.getOldestEventForPluginAndChain()

      expect(resultRange).toEqual(lastRange)
      expect(resultEvent).toEqual(oldestEvent)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledTimes(1)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledWith(
        ['across'],
        'ethereum',
      )
    })

    it('returns the oldest event for cluster plugin names', async () => {
      const eventA = makeInteropEventRecord({ timestamp: UnixTime(5) })
      const getOldestEventForPluginAndChain = mockFn().resolvesTo(eventA)

      const syncer = createSyncer({
        cluster: makeCluster({
          name: 'clusterName',
          plugins: [
            makePlugin({ name: 'across' }),
            makePlugin({ name: 'wormhole' }),
          ],
        }),
        db: mockObject<InteropEventSyncer['db']>({
          interopEvent: mockObject<InteropEventSyncer['db']['interopEvent']>({
            getOldestEventForPluginAndChain,
          }),
        }),
      })

      const resultEvent = await syncer.getOldestEventForPluginAndChain()

      expect(resultEvent).toEqual(eventA)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledTimes(1)
      expect(getOldestEventForPluginAndChain).toHaveBeenCalledWith(
        ['across', 'wormhole'],
        'ethereum',
      )
    })
  })

  describe('rpc wrapper methods', () => {
    it('passes through getBlockByNumber, getLogs, getTransactionReceipt, and getTransactionByHash', async () => {
      const getBlockByNumber = mockFn().resolvesTo(makeRpcBlock(5n))
      const log = makeRpcLog()
      const getLogs = mockFn().resolvesTo([log])
      const receipt = makeRpcReceipt()
      const getTransactionReceipt = mockFn().resolvesTo(receipt)
      const transaction = makeRpcTransaction()
      const getTransactionByHash = mockFn().resolvesTo(transaction)
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

      expect(block).toEqual(makeRpcBlock(5n))
      expect(logs).toEqual([log])
      expect(txReceipt).toEqual(receipt)
      expect(tx).toEqual(transaction)
    })
  })
})

class TestSyncer extends InteropEventSyncer {
  runInTransactionCalls = 0

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
    return await fn()
  }
}

function createSyncer(overrides: Partial<TestSyncer> = {}) {
  const plugin = makePlugin({ name: 'across' })
  const syncer = new TestSyncer(
    'ethereum',
    makeCluster({ name: 'clusterName', plugins: [plugin] }),
    mockRpcClient(),
    mockStore(),
    mockDb(),
    Logger.SILENT,
  )
  Object.assign(syncer, overrides)
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
  } = {},
): InteropPluginResyncable {
  return {
    name: params.name ?? 'across',
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
  checkStatus: ReturnType<typeof mockFn>
  processNewestBlock: ReturnType<typeof mockFn>
} {
  const checkStatus = mockFn<[], Promise<SyncerState>>()
  const processNewestBlock = mockFn<[], Promise<SyncerState>>()
  const state: BlockProcessorState = {
    type: 'blockProcessor',
    name: 'blockProcessor',
    status: 'idle',
    checkStatus,
    processNewestBlock,
  }
  checkStatus.resolvesTo(resultState ?? state)
  processNewestBlock.resolvesTo(resultState ?? state)
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
    getBlockByNumber: mockFn().resolvesTo(makeRpcBlock(1n)),
    getLogs: mockFn().resolvesTo([]),
    getTransactionReceipt: mockFn().resolvesTo(null),
    getTransactionByHash: mockFn().resolvesTo(null),
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

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const ZERO_HASH = `0x${'00'.repeat(32)}`
