import { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps } from '@l2beat/database'
import type { RpcBlock, RpcLog, RpcTransaction } from '@l2beat/shared'
import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { InteropEvent, LogToCapture } from '../../plugins/types'
import { CatchingUpState } from './CatchingUpState'
import { FollowingState } from './FollowingState'
import type { InteropEventSyncer } from './InteropEventSyncer'
import { LogQuery } from './InteropEventSyncer'

const CHAIN = 'ethereum'
const CLUSTER_NAME = 'mock-cluster'

describe(CatchingUpState.name, () => {
  describe(CatchingUpState.prototype.catchUp.name, () => {
    it('waits when latest block number is missing', async () => {
      const getResyncState = vi.fn().mockResolvedValue({
        resyncFrom: undefined,
        wipeRequired: false,
      })
      const syncer = createSyncer({
        latestBlockNumber: undefined,
        getResyncState,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toEqual(state)
      expect(state.status).toBe('waiting for block number')
      expect(getResyncState).toHaveBeenCalled()
    })

    it('resyncs from requested timestamp after wipe, clears flag and switches to following', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const getLogs = vi.fn().mockResolvedValue([])
      const clearResyncRequestUnlessWipePending = vi.fn().mockResolvedValue(1)

      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getResyncState: vi.fn().mockResolvedValue({
          resyncFrom: UnixTime(5),
          wipeRequired: false,
        }),
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ toBlock: 3n })),
        buildLogQuery: vi.fn().mockReturnValue(makeEmptyLogQuery()),
        saveProducedInteropEvents,
        getLogs,
        db: {
          interopPluginSyncState: {
            clearResyncRequestUnlessWipePending,
          } as unknown as InteropEventSyncer['db']['interopPluginSyncState'],
        } as unknown as InteropEventSyncer['db'],
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeInstanceOf(FollowingState)
      expect(getLogs).not.toHaveBeenCalled()
      expect(saveProducedInteropEvents).toHaveBeenCalledWith([], {
        fromBlock: 5n,
        fromTimestamp: UnixTime(5),
        toBlock: 10n,
        toTimestamp: UnixTime(10),
      })
      expect(clearResyncRequestUnlessWipePending).toHaveBeenCalledWith(
        CLUSTER_NAME,
        CHAIN,
      )
    })

    it('waits for wipe when resync is requested and wipeRequired is set', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)

      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getResyncState: vi.fn().mockResolvedValue({
          resyncFrom: UnixTime(5),
          wipeRequired: true,
        }),
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toEqual(state)
      expect(state.status).toBe('waiting for wipe')
      expect(syncer.waitingForWipe).toBe(true)
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('waits for wipe even when latest block number is missing', async () => {
      const syncer = createSyncer({
        latestBlockNumber: undefined,
        getResyncState: vi.fn().mockResolvedValue({
          resyncFrom: UnixTime(5),
          wipeRequired: true,
        }),
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toEqual(state)
      expect(state.status).toBe('waiting for wipe')
      expect(syncer.waitingForWipe).toBe(true)
    })

    it('switches to following when already synced to latest block', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const getLogs = vi.fn().mockResolvedValue([])
      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ toBlock: 10n })),
        saveProducedInteropEvents,
        getLogs,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeInstanceOf(FollowingState)
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
      expect(getLogs).not.toHaveBeenCalled()
    })

    it('syncs one range and switches to following at the tip', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 9n })),
        buildLogQuery: vi.fn().mockReturnValue(makeEmptyLogQuery()),
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeInstanceOf(FollowingState)
      expect(saveProducedInteropEvents).toHaveBeenCalledWith([], {
        fromBlock: 1n,
        fromTimestamp: UnixTime(1),
        toBlock: 10n,
        toTimestamp: UnixTime(10),
      })
    })

    it('shows the active range before saving it', async () => {
      let resolveSaveProducedInteropEvents!: () => void
      const saveProducedInteropEvents = vi.fn().mockReturnValue(
        new Promise<void>((resolve) => {
          resolveSaveProducedInteropEvents = resolve
        }),
      )
      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 9n })),
        buildLogQuery: vi.fn().mockReturnValue(makeEmptyLogQuery()),
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const catchUpPromise = state.catchUp()
      await flushAsyncWork()

      expect(state.status).toBe('saving events 10-10 (0 behind tip, 0 events)')

      resolveSaveProducedInteropEvents()
      const nextState = await catchUpPromise

      expect(nextState).toBeInstanceOf(FollowingState)
    })

    it('syncs multiple ranges until the tip is reached', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const getLastSyncedRange = vi
        .fn()
        .mockResolvedValueOnce(makeSyncedRange({ fromBlock: 1n, toBlock: 0n }))
        .mockResolvedValueOnce(
          makeSyncedRange({ fromBlock: 1n, toBlock: 10000n }),
        )
        .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 10000n }))

      const syncer = createSyncer({
        latestBlockNumber: 20_000n,
        getLastSyncedRange,
        buildLogQuery: vi.fn().mockReturnValue(makeEmptyLogQuery()),
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeInstanceOf(FollowingState)
      expect(saveProducedInteropEvents).toHaveBeenCalledTimes(2)
      expect(saveProducedInteropEvents).toHaveBeenNthCalledWith(1, [], {
        fromBlock: 1n,
        fromTimestamp: UnixTime(1),
        toBlock: 10000n,
        toTimestamp: UnixTime(10000),
      })
      expect(saveProducedInteropEvents).toHaveBeenNthCalledWith(2, [], {
        fromBlock: 1n,
        fromTimestamp: UnixTime(1),
        toBlock: 20_000n,
        toTimestamp: UnixTime(20_000),
      })
    })

    it('captures logs, flattens events and saves them', async () => {
      const eventA = {} as unknown as InteropEvent
      const eventB = {} as unknown as InteropEvent
      const eventC = {} as unknown as InteropEvent
      const captureLog = vi
        .fn()
        .mockReturnValueOnce([eventA])
        .mockReturnValueOnce([eventB, eventC])
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const getLogs = vi
        .fn()
        .mockResolvedValue([
          makeRpcLog({ txHash: '0xaaa', blockNumber: 2n, blockTimestamp: 2n }),
          makeRpcLog({ txHash: '0xaaa', blockNumber: 2n, blockTimestamp: 2n }),
        ])

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 1n })),
        buildLogQuery: vi.fn().mockReturnValue(makeNonEmptyLogQuery()),
        getLogs,
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeInstanceOf(FollowingState)
      expect(getLogs).toHaveBeenCalled()
      expect(captureLog).toHaveBeenCalledTimes(2)
      expect(saveProducedInteropEvents).toHaveBeenCalledWith(
        [eventA, eventB, eventC],
        {
          fromBlock: 1n,
          fromTimestamp: UnixTime(1),
          toBlock: 2n,
          toTimestamp: UnixTime(2),
        },
      )
    })

    it('omits address filter when addresses are wildcard', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const getLogs = vi.fn().mockResolvedValue([])

      const logQuery = new LogQuery()
      logQuery.addresses = '*'
      logQuery.topic0s.add('0xabc')

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 1n })),
        buildLogQuery: vi.fn().mockReturnValue(logQuery),
        getLogs,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await state.catchUp()

      expect(getLogs.mock.calls[0][0]).toEqual({
        fromBlock: 2n,
        toBlock: 2n,
        topics: [['0xabc']],
      })
    })

    it('fetches transaction receipt logs when includeTxEvents are configured', async () => {
      const baseTopic0 = '0xaaa'
      const extraTopic0 = '0xbbb'
      const otherTopic0 = '0xccc'
      const txHash = `0x${'11'.repeat(32)}`

      const captureLog = vi.fn().mockReturnValue(undefined)
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)

      const logQuery = new LogQuery()
      addAddress(logQuery, EthereumAddress.random())
      logQuery.topic0s.add(baseTopic0)
      logQuery.topicToTxEvents.set(baseTopic0, new Set([extraTopic0]))

      const getLogs = vi.fn().mockResolvedValue([
        makeRpcLog({
          txHash,
          blockNumber: 2n,
          blockTimestamp: 2n,
          topics: [baseTopic0],
          logIndex: 0n,
        }),
      ])

      const receiptLogs = [
        makeRpcLog({
          txHash,
          blockNumber: 2n,
          blockTimestamp: 2n,
          topics: [baseTopic0],
          logIndex: 0n,
        }),
        makeRpcLog({
          txHash,
          blockNumber: 2n,
          blockTimestamp: 2n,
          topics: [extraTopic0],
          logIndex: 1n,
        }),
        makeRpcLog({
          txHash,
          blockNumber: 2n,
          blockTimestamp: 2n,
          topics: [otherTopic0],
          logIndex: 2n,
        }),
      ]
      const receipt = {
        transactionHash: txHash,
        transactionIndex: 0n,
        blockHash: ZERO_HASH,
        blockNumber: 2n,
        from: EthereumAddress.random(),
        to: EthereumAddress.random(),
        cumulativeGasUsed: 0n,
        gasUsed: 0n,
        contractAddress: null,
        logs: receiptLogs,
        logsBloom: `0x${'00'.repeat(256)}`,
        type: 0n,
      }
      const getTransactionReceipt = vi.fn().mockResolvedValue(receipt)

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 1n })),
        buildLogQuery: vi.fn().mockReturnValue(logQuery),
        getLogs,
        getTransactionReceipt,
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await state.catchUp()

      expect(getTransactionReceipt).toHaveBeenCalledWith(txHash)
      expect(captureLog).toHaveBeenCalledTimes(1)
      const captured = captureLog.mock.calls[0][0] as LogToCapture | undefined
      expect(captured?.txLogs.map((log) => log.topics[0])).toEqual([
        baseTopic0,
        extraTopic0,
        otherTopic0,
      ])
    })

    it('fetches transaction data when includeTx is configured', async () => {
      const baseTopic0 = '0xaaa'
      const txHash = `0x${'22'.repeat(32)}`

      const captureLog = vi.fn().mockReturnValue(undefined)
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)

      const logQuery = new LogQuery()
      addAddress(logQuery, EthereumAddress.random())
      logQuery.topic0s.add(baseTopic0)
      logQuery.topic0sWithTx.add(baseTopic0)

      const getLogs = vi.fn().mockResolvedValue([
        makeRpcLog({
          txHash,
          blockNumber: 2n,
          blockTimestamp: 2n,
          topics: [baseTopic0],
          logIndex: 0n,
        }),
      ])

      const transaction = makeRpcTransaction({
        hash: txHash,
        input: '0xabc',
        value: 123n,
      })
      const getTransactionByHash = vi.fn().mockResolvedValue(transaction)

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 1n })),
        buildLogQuery: vi.fn().mockReturnValue(logQuery),
        getLogs,
        getTransactionByHash,
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await state.catchUp()

      expect(getTransactionByHash).toHaveBeenCalledWith(txHash)
      const captured = captureLog.mock.calls[0][0] as LogToCapture | undefined
      assert(captured?.tx.kind === 'canonical')
      expect(captured?.tx.hash).toEqual(txHash)
      expect(captured?.tx.data).toEqual(transaction.input!)
      expect(captured?.tx.value).toEqual(transaction.value!)
      expect(captured?.tx.from).toEqual(transaction.from)
      expect(captured?.tx.to).toEqual(transaction.to?.toString())
    })

    it('maps call-only bundle transaction fields for includeTx', async () => {
      const baseTopic0 = '0xaaa'
      const txHash = `0x${'23'.repeat(32)}`

      const captureLog = vi.fn().mockReturnValue(undefined)
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)

      const logQuery = new LogQuery()
      addAddress(logQuery, EthereumAddress.random())
      logQuery.topic0s.add(baseTopic0)
      logQuery.topic0sWithTx.add(baseTopic0)

      const getLogs = vi.fn().mockResolvedValue([
        makeRpcLog({
          txHash,
          blockNumber: 2n,
          blockTimestamp: 2n,
          topics: [baseTopic0],
          logIndex: 0n,
        }),
      ])

      const callTo = EthereumAddress.random()
      const transaction = makeRpcTransaction({
        hash: txHash,
        type: 118n,
        to: undefined,
        input: undefined,
        value: undefined,
        calls: [
          {
            to: callTo,
            value: 321n,
            input: '0xabc',
          },
        ],
      })
      const getTransactionByHash = vi.fn().mockResolvedValue(transaction)

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 1n })),
        buildLogQuery: vi.fn().mockReturnValue(logQuery),
        getLogs,
        getTransactionByHash,
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await state.catchUp()

      expect(getTransactionByHash).toHaveBeenCalledWith(txHash)
      const captured = captureLog.mock.calls[0][0] as LogToCapture | undefined
      assert(captured?.tx.kind === 'bundle')
      expect(captured?.tx.hash).toEqual(txHash)
      expect(captured?.tx.from).toEqual(transaction.from)
      expect(captured?.tx.calls).toEqual([
        {
          to: callTo,
          value: 321n,
          data: '0xabc',
        },
      ])
    })

    it('retries with smaller ranges after log response size exceeded', async () => {
      const saveProducedInteropEvents = vi.fn().mockResolvedValue(undefined)
      const getLogs = vi
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('Log response size exceeded')
        })
        .mockImplementationOnce(() => {
          throw new Error('Log response size exceeded')
        })

      const syncer = createSyncer({
        latestBlockNumber: 20_000n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 0n })),
        buildLogQuery: vi.fn().mockReturnValue(makeNonEmptyLogQuery()),
        getLogs,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const firstState = await state.catchUp()

      expect(firstState).toEqual(state)
      expect(state.status).toBe('retrying smaller range [/2]')
      expect(syncer.logRangeDivider).toBe(1)
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()

      const secondState = await state.catchUp()

      expect(secondState).toEqual(state)
      expect(state.status).toBe('retrying smaller range [/4]')
      expect(syncer.logRangeDivider).toBe(2)
      const secondCall = getLogs.mock.calls[1][0]
      expect(secondCall?.fromBlock).toBe(1n)
      expect(secondCall?.toBlock).toBe(5_000n)
    })

    it('throws after too many log range divider increments', async () => {
      const getLogs = vi.fn().mockImplementation(() => {
        throw new Error('Log response size exceeded')
      })

      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: vi
          .fn()
          .mockResolvedValue(makeSyncedRange({ fromBlock: 1n, toBlock: 0n })),
        buildLogQuery: vi.fn().mockReturnValue(makeNonEmptyLogQuery()),
        getLogs,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await state.catchUp()
      await state.catchUp()
      await state.catchUp()
      await expect(async () => await state.catchUp()).rejects.toThrow(
        /Log range divider exceeded/,
      )
    })

    it('transitions to FollowingState when no synced range and no resync timestamp', async () => {
      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: vi.fn().mockResolvedValue(undefined),
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeInstanceOf(FollowingState)
    })
  })
})

function createSyncer(
  overrides: Partial<InteropEventSyncer> = {},
): InteropEventSyncer {
  return {
    chain: CHAIN as InteropEventSyncer['chain'],
    cluster: {
      name: CLUSTER_NAME,
      plugins: [],
    } as InteropEventSyncer['cluster'],
    latestBlockNumber: 10n,
    waitingForWipe: false,
    logRangeDivider: undefined,
    getResyncState: vi.fn().mockResolvedValue({
      resyncFrom: undefined,
      wipeRequired: false,
    }),
    getLastSyncedRange: vi.fn().mockResolvedValue(undefined),
    getBlockByNumber: vi
      .fn()
      .mockImplementation((blockNumber: bigint) => makeRpcBlock(blockNumber)),
    buildLogQuery: vi.fn().mockReturnValue(makeEmptyLogQuery()),
    getLogs: vi.fn().mockResolvedValue([]),
    getTransactionReceipt: vi.fn().mockResolvedValue(null),
    getTransactionByHash: vi.fn().mockResolvedValue(null),
    captureLog: vi.fn().mockReturnValue(undefined),
    saveProducedInteropEvents: vi.fn().mockResolvedValue(undefined),
    db: {
      interopPluginSyncState: {
        clearResyncRequestUnlessWipePending: vi.fn().mockResolvedValue(1),
      } as unknown as InteropEventSyncer['db']['interopPluginSyncState'],
    } as unknown as InteropEventSyncer['db'],
    ...overrides,
  } as unknown as InteropEventSyncer
}

function makeEmptyLogQuery() {
  return new LogQuery()
}

function makeNonEmptyLogQuery() {
  const logQuery = new LogQuery()
  addAddress(logQuery, EthereumAddress.random())
  logQuery.topic0s.add('0xabc')
  return logQuery
}

function addAddress(logQuery: LogQuery, address: EthereumAddress) {
  if (logQuery.addresses === '*') {
    throw new Error('Expected address filter to be a set')
  }
  logQuery.addresses.add(address)
}

function makeSyncedRange(
  overrides: Partial<BlockRangeWithTimestamps> = {},
): BlockRangeWithTimestamps {
  return {
    fromBlock: 1n,
    fromTimestamp: UnixTime(1),
    toBlock: 1n,
    toTimestamp: UnixTime(1),
    ...overrides,
  }
}

function makeRpcBlock(blockNumber: bigint): RpcBlock {
  return {
    number: blockNumber,
    timestamp: blockNumber,
  } as RpcBlock
}

function makeRpcLog(params: {
  txHash: string
  blockNumber: bigint
  blockTimestamp: bigint
  topics?: string[]
  logIndex?: bigint
}): RpcLog {
  return {
    address: EthereumAddress.random(),
    data: '0x',
    topics: params.topics ?? [],
    logIndex: params.logIndex ?? 0n,
    transactionIndex: 0n,
    transactionHash: params.txHash,
    blockNumber: params.blockNumber,
    blockTimestamp: params.blockTimestamp,
    blockHash: ZERO_HASH,
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

async function flushAsyncWork() {
  await new Promise<void>((resolve) => setImmediate(resolve))
}

const ZERO_HASH = `0x${'00'.repeat(32)}`
