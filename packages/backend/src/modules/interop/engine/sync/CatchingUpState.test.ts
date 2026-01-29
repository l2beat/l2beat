import { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps } from '@l2beat/database'
import type { RpcBlock, RpcLog, RpcTransaction } from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
      const getResyncState = mockFn().resolvesTo({
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
      expect(state.status).toEqual('waiting for block number')
      expect(getResyncState).not.toHaveBeenCalled()
    })

    it('resyncs from requested timestamp after wipe, clears flag and switches to following', async () => {
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const getLogs = mockFn().resolvesTo([])
      const clearResyncRequestUnlessWipePending = mockFn().resolvesTo(1)

      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getResyncState: mockFn().resolvesTo({
          resyncFrom: UnixTime(5),
          wipeRequired: false,
        }),
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ toBlock: 3n }),
        ),
        buildLogQuery: mockFn().returns(makeEmptyLogQuery()),
        saveProducedInteropEvents,
        getLogs,
        db: mockObject<InteropEventSyncer['db']>({
          interopPluginSyncState: mockObject<
            InteropEventSyncer['db']['interopPluginSyncState']
          >({
            clearResyncRequestUnlessWipePending,
          }),
        }),
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeA(FollowingState)
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
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)

      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getResyncState: mockFn().resolvesTo({
          resyncFrom: UnixTime(5),
          wipeRequired: true,
        }),
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toEqual(state)
      expect(state.status).toEqual('waiting for wipe')
      expect(syncer.waitingForWipe).toEqual(true)
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
    })

    it('switches to following when already synced to latest block', async () => {
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const getLogs = mockFn().resolvesTo([])
      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ toBlock: 10n }),
        ),
        saveProducedInteropEvents,
        getLogs,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeA(FollowingState)
      expect(saveProducedInteropEvents).not.toHaveBeenCalled()
      expect(getLogs).not.toHaveBeenCalled()
    })

    it('syncs one range and switches to following at the tip', async () => {
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ fromBlock: 1n, toBlock: 9n }),
        ),
        buildLogQuery: mockFn().returns(makeEmptyLogQuery()),
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeA(FollowingState)
      expect(saveProducedInteropEvents).toHaveBeenCalledWith([], {
        fromBlock: 1n,
        fromTimestamp: UnixTime(1),
        toBlock: 10n,
        toTimestamp: UnixTime(10),
      })
    })

    it('syncs multiple ranges until the tip is reached', async () => {
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const getLastSyncedRange = mockFn()
        .resolvesToOnce(makeSyncedRange({ fromBlock: 1n, toBlock: 0n }))
        .resolvesToOnce(makeSyncedRange({ fromBlock: 1n, toBlock: 10000n }))
        .resolvesTo(makeSyncedRange({ fromBlock: 1n, toBlock: 10000n }))

      const syncer = createSyncer({
        latestBlockNumber: 20_000n,
        getLastSyncedRange,
        buildLogQuery: mockFn().returns(makeEmptyLogQuery()),
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeA(FollowingState)
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
      const eventA = mockObject<InteropEvent>({})
      const eventB = mockObject<InteropEvent>({})
      const eventC = mockObject<InteropEvent>({})
      const captureLog = mockFn()
        .returnsOnce([eventA])
        .returnsOnce([eventB, eventC])
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)
      const getLogs = mockFn().resolvesTo([
        makeRpcLog({ txHash: '0xaaa', blockNumber: 2n, blockTimestamp: 2n }),
        makeRpcLog({ txHash: '0xaaa', blockNumber: 2n, blockTimestamp: 2n }),
      ])

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ fromBlock: 1n, toBlock: 1n }),
        ),
        buildLogQuery: mockFn().returns(makeNonEmptyLogQuery()),
        getLogs,
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      const nextState = await state.catchUp()

      expect(nextState).toBeA(FollowingState)
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

    it('fetches transaction receipt logs when includeTxEvents are configured', async () => {
      const baseTopic0 = '0xaaa'
      const extraTopic0 = '0xbbb'
      const otherTopic0 = '0xccc'
      const txHash = `0x${'11'.repeat(32)}`

      const captureLog = mockFn().returns(undefined)
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)

      const logQuery = new LogQuery()
      logQuery.addresses.add(EthereumAddress.random())
      logQuery.topic0s.add(baseTopic0)
      logQuery.topicToTxEvents.set(baseTopic0, new Set([extraTopic0]))

      const getLogs = mockFn().resolvesTo([
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
      const getTransactionReceipt = mockFn().resolvesTo(receipt)

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ fromBlock: 1n, toBlock: 1n }),
        ),
        buildLogQuery: mockFn().returns(logQuery),
        getLogs,
        getTransactionReceipt,
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await state.catchUp()

      expect(getTransactionReceipt).toHaveBeenCalledWith(txHash)
      expect(captureLog).toHaveBeenCalledTimes(1)
      const captured = captureLog.calls[0]?.args[0] as LogToCapture | undefined
      expect(captured?.txLogs.map((log) => log.topics[0])).toEqual([
        baseTopic0,
        extraTopic0,
        otherTopic0,
      ])
    })

    it('fetches transaction data when includeTx is configured', async () => {
      const baseTopic0 = '0xaaa'
      const txHash = `0x${'22'.repeat(32)}`

      const captureLog = mockFn().returns(undefined)
      const saveProducedInteropEvents = mockFn().resolvesTo(undefined)

      const logQuery = new LogQuery()
      logQuery.addresses.add(EthereumAddress.random())
      logQuery.topic0s.add(baseTopic0)
      logQuery.topic0sWithTx.add(baseTopic0)

      const getLogs = mockFn().resolvesTo([
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
      const getTransactionByHash = mockFn().resolvesTo(transaction)

      const syncer = createSyncer({
        latestBlockNumber: 2n,
        getLastSyncedRange: mockFn().resolvesTo(
          makeSyncedRange({ fromBlock: 1n, toBlock: 1n }),
        ),
        buildLogQuery: mockFn().returns(logQuery),
        getLogs,
        getTransactionByHash,
        captureLog,
        saveProducedInteropEvents,
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await state.catchUp()

      expect(getTransactionByHash).toHaveBeenCalledWith(txHash)
      const captured = captureLog.calls[0]?.args[0] as LogToCapture | undefined
      expect(captured?.tx.hash).toEqual(txHash)
      expect(captured?.tx.data).toEqual(transaction.input)
      expect(captured?.tx.value).toEqual(transaction.value)
      expect(captured?.tx.from).toEqual(transaction.from)
      expect(captured?.tx.to).toEqual(transaction.to?.toString())
    })

    it('throws when no synced range and no resync timestamp', async () => {
      const syncer = createSyncer({
        latestBlockNumber: 10n,
        getLastSyncedRange: mockFn().resolvesTo(undefined),
      })
      const state = new CatchingUpState(syncer, Logger.SILENT)

      await expect(async () => await state.catchUp()).toBeRejectedWith(
        `Can't resync ${CLUSTER_NAME} cluster without "from" timestamp`,
      )
    })
  })
})

function createSyncer(
  overrides: Partial<InteropEventSyncer> = {},
): InteropEventSyncer {
  return mockObject<InteropEventSyncer>({
    chain: CHAIN as InteropEventSyncer['chain'],
    cluster: {
      name: CLUSTER_NAME,
      plugins: [],
    } as InteropEventSyncer['cluster'],
    latestBlockNumber: 10n,
    waitingForWipe: false,
    getResyncState: mockFn().resolvesTo({
      resyncFrom: undefined,
      wipeRequired: false,
    }),
    getLastSyncedRange: mockFn().resolvesTo(undefined),
    getBlockByNumber: mockFn().executes((blockNumber: bigint) =>
      makeRpcBlock(blockNumber),
    ),
    buildLogQuery: mockFn().returns(makeEmptyLogQuery()),
    getLogs: mockFn().resolvesTo([]),
    getTransactionReceipt: mockFn().resolvesTo(null),
    getTransactionByHash: mockFn().resolvesTo(null),
    captureLog: mockFn().returns(undefined),
    saveProducedInteropEvents: mockFn().resolvesTo(undefined),
    db: mockObject<InteropEventSyncer['db']>({
      interopPluginSyncState: mockObject<
        InteropEventSyncer['db']['interopPluginSyncState']
      >({
        clearResyncRequestUnlessWipePending: mockFn().resolvesTo(1),
      }),
    }),
    ...overrides,
  })
}

function makeEmptyLogQuery() {
  return new LogQuery()
}

function makeNonEmptyLogQuery() {
  const logQuery = new LogQuery()
  logQuery.addresses.add(EthereumAddress.random())
  logQuery.topic0s.add('0xabc')
  return logQuery
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

const ZERO_HASH = `0x${'00'.repeat(32)}`
