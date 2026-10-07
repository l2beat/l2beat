import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { expect, type MockFunction, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import type { InteropEventStore } from '../../engine/capture/InteropEventStore'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import type { GetRequestsResponse, RelayApiClient } from './RelayApiClient'
import {
  RelayIndexer,
  RelayRootIndexer,
  TokenReceived,
  TokenSent,
} from './relay.indexer'

const FROM = 1787583059
const BATCH_SIZE = 60
const MAX_REQUESTS_PER_CHUNK = 10_000
const SAFE_TIME_OFFSET = 10
const CHAINS = [
  { id: 1, name: 'ethereum' },
  { id: 10, name: 'optimism' },
]

describe(RelayRootIndexer.name, () => {
  it('never targets a second that has not fully elapsed', async () => {
    const target = await new RelayRootIndexer(
      Logger.SILENT,
      SAFE_TIME_OFFSET,
    ).tick()

    expect(UnixTime.now() - target).toBeGreaterThanOrEqual(SAFE_TIME_OFFSET)
  })
})

describe(RelayIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(RelayIndexer.prototype.update.name, () => {
    it('fetches one batch window and advances by it', async () => {
      const relayApiClient = clientReturning({ requests: [] })
      const indexer = createIndexer(relayApiClient)

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(relayApiClient.getAllRequests).toHaveBeenCalledWith({
        startTimestamp: FROM,
        endTimestamp: FROM + BATCH_SIZE + 1,
        limit: 10_000,
        status: 'success',
      })
      expect(syncedTo).toEqual(FROM + BATCH_SIZE)
    })

    it('clamps the window to the target height', async () => {
      const relayApiClient = clientReturning({ requests: [] })
      const indexer = createIndexer(relayApiClient)

      const syncedTo = await indexer.update(FROM, FROM + 5)

      expect(relayApiClient.getAllRequests).toHaveBeenCalledWith({
        startTimestamp: FROM,
        endTimestamp: FROM + 6,
        limit: 10_000,
        status: 'success',
      })
      expect(syncedTo).toEqual(FROM + 5)
    })

    it('partitions the window for concurrent fetching', async () => {
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().resolvesTo({ requests: [] })
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
        { concurrency: 3 },
      )

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(syncedTo).toEqual(FROM + BATCH_SIZE)
      expect(getAllRequests.calls.map((call) => call.args[0])).toEqual([
        {
          startTimestamp: FROM,
          endTimestamp: FROM + 21,
          limit: MAX_REQUESTS_PER_CHUNK,
          status: 'success',
        },
        {
          startTimestamp: FROM + 21,
          endTimestamp: FROM + 41,
          limit: MAX_REQUESTS_PER_CHUNK,
          status: 'success',
        },
        {
          startTimestamp: FROM + 41,
          endTimestamp: FROM + BATCH_SIZE + 1,
          limit: MAX_REQUESTS_PER_CHUNK,
          status: 'success',
        },
      ])
    })

    it('filters by chain when exactly one tracked chain can be resolved', async () => {
      const relayApiClient = clientReturning({ requests: [] })
      const indexer = createIndexer(relayApiClient, {
        chains: CHAINS,
        trackedChains: ['optimism'],
      })

      await indexer.update(FROM, FROM)

      expect(relayApiClient.getAllRequests).toHaveBeenCalledWith({
        startTimestamp: FROM,
        endTimestamp: FROM + 1,
        limit: MAX_REQUESTS_PER_CHUNK,
        status: 'success',
        chainId: 10,
      })
    })

    it('serializes saves across concurrent partitions for deduplication', async () => {
      const relayApiClient = clientReturning({
        requests: [successRequest('a')],
      })
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(relayApiClient, {
        chains: CHAINS,
        concurrency: 3,
        interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
      })

      await indexer.update(FROM, FROM + BATCH_SIZE)

      expect(savedIds(saveNewEvents)).toEqual([['a']])
    })

    it('advances through a second holding more entries than one page', async () => {
      const relayApiClient = clientReturning({
        requests: manyInSameSecond(619, '2026-08-24T14:50:59'),
      })
      const indexer = createIndexer(relayApiClient)

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(syncedTo).toEqual(FROM + BATCH_SIZE)
    })

    it('advances when the window holds no entries at all', async () => {
      const relayApiClient = clientReturning({ requests: [] })
      const indexer = createIndexer(relayApiClient)

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(syncedTo).toEqual(FROM + BATCH_SIZE)
    })

    it('follows continuations without refetching or shrinking the window', async () => {
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().executes(async (options) => {
        switch (options?.continuation) {
          case undefined:
            return { requests: [successRequest('a')], continuation: 'cursor-1' }
          case 'cursor-1':
            return { requests: [successRequest('b')], continuation: 'cursor-2' }
          default:
            return { requests: [successRequest('c')] }
        }
      })
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
        {
          chains: CHAINS,
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(syncedTo).toEqual(FROM + BATCH_SIZE)
      expect(getAllRequests).toHaveBeenCalledTimes(3)
      expect(getAllRequests.calls.map((call) => call.args[0])).toEqual([
        {
          startTimestamp: FROM,
          endTimestamp: FROM + BATCH_SIZE + 1,
          limit: MAX_REQUESTS_PER_CHUNK,
          status: 'success',
          chainId: 1,
        },
        {
          startTimestamp: FROM,
          endTimestamp: FROM + BATCH_SIZE + 1,
          limit: MAX_REQUESTS_PER_CHUNK,
          status: 'success',
          chainId: 1,
          continuation: 'cursor-1',
        },
        {
          startTimestamp: FROM,
          endTimestamp: FROM + BATCH_SIZE + 1,
          limit: MAX_REQUESTS_PER_CHUNK,
          status: 'success',
          chainId: 1,
          continuation: 'cursor-2',
        },
      ])
      expect(getAllRequests).toHaveBeenLastCalledWith({
        startTimestamp: FROM,
        endTimestamp: FROM + BATCH_SIZE + 1,
        limit: MAX_REQUESTS_PER_CHUNK,
        status: 'success',
        chainId: 1,
        continuation: 'cursor-2',
      })
      expect(savedIds(saveNewEvents)).toEqual([['a'], ['b'], ['c']])
    })

    it('does not save the same request twice across continuation chunks', async () => {
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().executes(async (options) =>
        options?.continuation === undefined
          ? { requests: [successRequest('a')], continuation: 'cursor-1' }
          : { requests: [successRequest('a'), successRequest('b')] },
      )
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
        {
          chains: CHAINS,
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      await indexer.update(FROM, FROM)

      expect(savedIds(saveNewEvents)).toEqual([['a'], ['b']])
    })

    it('advances at exactly the cap when no continuation remains', async () => {
      const relayApiClient = clientReturning({
        requests: manyInSameSecond(
          MAX_REQUESTS_PER_CHUNK,
          '2026-08-24T14:50:59',
        ),
      })
      const indexer = createIndexer(relayApiClient)

      expect(await indexer.update(FROM, FROM + BATCH_SIZE)).toEqual(
        FROM + BATCH_SIZE,
      )
      expect(relayApiClient.getAllRequests).toHaveBeenCalledTimes(1)
    })

    it('saves a completed chunk before propagating a later fetch failure', async () => {
      const getAllRequests = mockFn<RelayApiClient['getAllRequests']>()
        .resolvesToOnce({
          requests: [successRequest('partial')],
          continuation: 'cursor-1',
        })
        .rejectsWith(new Error('network timeout'))
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
        {
          chains: CHAINS,
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      await expect(indexer.update(FROM, FROM + BATCH_SIZE)).toBeRejectedWith(
        'network timeout',
      )
      expect(getAllRequests).toHaveBeenCalledTimes(2)
      expect(savedIds(saveNewEvents)).toEqual([['partial']])
    })

    it('retries events whose save failed instead of skipping them', async () => {
      const relayApiClient = clientReturning({
        requests: [successRequest('a')],
      })
      const saveNewEvents = mockFn<InteropEventStore['saveNewEvents']>()
        .rejectsWithOnce(new Error('db down'))
        .resolvesTo(undefined)
      const indexer = createIndexer(relayApiClient, {
        chains: CHAINS,
        interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
      })

      await expect(indexer.update(FROM, FROM + BATCH_SIZE)).toBeRejectedWith(
        'db down',
      )
      expect(await indexer.update(FROM, FROM + BATCH_SIZE)).toEqual(
        FROM + BATCH_SIZE,
      )
      expect(savedIds(saveNewEvents)).toEqual([['a'], ['a']])
    })

    it('retries only the chunk whose save failed', async () => {
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().executes(async (options) =>
        options?.continuation === undefined
          ? { requests: [successRequest('a')], continuation: 'cursor-1' }
          : { requests: [successRequest('b')] },
      )
      const saveNewEvents = mockFn<InteropEventStore['saveNewEvents']>()
        .resolvesToOnce(undefined)
        .rejectsWithOnce(new Error('db down'))
        .resolvesTo(undefined)
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
        {
          chains: CHAINS,
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      await expect(indexer.update(FROM, FROM)).toBeRejectedWith('db down')
      expect(await indexer.update(FROM, FROM)).toEqual(FROM)
      expect(savedIds(saveNewEvents)).toEqual([['a'], ['b'], ['b']])
    })

    it('does not resave earlier chunks when retrying after a later chunk failed to fetch', async () => {
      let secondChunkAttempts = 0
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().executes(async (options) => {
        if (options?.continuation === undefined) {
          return { requests: [successRequest('a')], continuation: 'cursor-1' }
        }
        secondChunkAttempts++
        if (secondChunkAttempts === 1) {
          throw new Error('network timeout')
        }
        return { requests: [successRequest('b')] }
      })
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
        {
          chains: CHAINS,
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      await expect(indexer.update(FROM, FROM)).toBeRejectedWith(
        'network timeout',
      )
      expect(await indexer.update(FROM, FROM)).toEqual(FROM)
      expect(savedIds(saveNewEvents)).toEqual([['a'], ['b']])
    })

    it('rejects a repeated continuation cursor instead of looping forever', async () => {
      const relayApiClient = clientReturning({
        requests: [successRequest('a')],
        continuation: 'cursor-1',
      })
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(relayApiClient, {
        chains: CHAINS,
        interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
      })

      await expect(indexer.update(FROM, FROM)).toBeRejectedWith(
        'repeated continuation cursor',
      )
      expect(relayApiClient.getAllRequests).toHaveBeenCalledTimes(2)
    })

    it('rejects a continuation cursor that comes without requests', async () => {
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().executes(async (options) => {
        if (options?.continuation === undefined) {
          return { requests: [successRequest('a')], continuation: 'cursor-1' }
        }
        return { requests: [], continuation: `${options.continuation}-next` }
      })
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
        {
          chains: CHAINS,
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      await expect(indexer.update(FROM, FROM)).toBeRejectedWith(
        'continuation cursor without requests',
      )
      expect(getAllRequests).toHaveBeenCalledTimes(2)
    })

    it('treats an empty continuation as a fully fetched window', async () => {
      const relayApiClient = clientReturning({
        requests: manyInSameSecond(3, '2026-08-24T14:50:59'),
        continuation: '',
      })
      const indexer = createIndexer(relayApiClient)

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(syncedTo).toEqual(FROM + BATCH_SIZE)
    })

    it('creates events from normalized v3 request fields', async () => {
      const sourceToken = '0x1111111111111111111111111111111111111111'
      const destinationToken = '0x2222222222222222222222222222222222222222'
      const relayApiClient = clientReturning({
        requests: [
          {
            id: 'request-1',
            status: 'success',
            sourceTx: {
              hash: `0x${'1'.repeat(64)}`,
              chainId: 1,
              timestamp: 100,
            },
            destinationTx: {
              hash: `0x${'2'.repeat(64)}`,
              chainId: 10,
              timestamp: 200,
            },
            sourceCurrency: {
              amount: '123',
              currency: { address: sourceToken },
            },
            destinationCurrency: {
              amount: '456',
              currency: { address: destinationToken },
            },
            createdAt: '2026-08-24T14:50:59.000Z',
            updatedAt: '2026-08-24T14:51:00.000Z',
          },
        ],
      })
      const saveNewEvents =
        mockFn<InteropEventStore['saveNewEvents']>().resolvesTo(undefined)
      const indexer = createIndexer(relayApiClient, {
        chains: CHAINS,
        trackedChains: ['ethereum', 'optimism'],
        interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
      })

      await indexer.update(FROM, FROM + BATCH_SIZE)

      const events = saveNewEvents.calls[0]?.args[0] ?? []
      expect(
        events.map((event) => ({
          type: event.type,
          args: event.args,
          chain: event.ctx.chain,
          txHash: event.ctx.txHash,
        })),
      ).toEqual([
        {
          type: TokenSent.type,
          args: {
            id: 'request-1',
            amount: '123',
            token: Address32.from(sourceToken),
            $dstChain: 'optimism',
          },
          chain: 'ethereum',
          txHash: `0x${'1'.repeat(64)}`,
        },
        {
          type: TokenReceived.type,
          args: {
            id: 'request-1',
            amount: '456',
            token: Address32.from(destinationToken),
            $srcChain: 'ethereum',
          },
          chain: 'optimism',
          txHash: `0x${'2'.repeat(64)}`,
        },
      ])
    })
  })
})

function clientReturning(response: GetRequestsResponse) {
  return mockObject<RelayApiClient>({
    getAllRequests: mockFn().resolvesTo(response),
  })
}

function successRequest(id: string) {
  return {
    id,
    status: 'success',
    sourceTx: { hash: `0x${'1'.repeat(64)}`, chainId: 1, timestamp: FROM },
    destinationTx: {
      hash: `0x${'2'.repeat(64)}`,
      chainId: 10,
      timestamp: FROM,
    },
    createdAt: '2026-08-24T14:50:59.000Z',
    updatedAt: '2026-08-24T14:50:59.000Z',
  }
}

function manyInSameSecond(count: number, second: string) {
  return Array.from({ length: count }, (_, i) => ({
    id: `0x${i}`,
    status: 'success',
    createdAt: `${second}.000Z`,
    updatedAt: `${second}.${String(i % 1000).padStart(3, '0')}Z`,
  }))
}

function createIndexer(
  relayApiClient: RelayApiClient,
  options: {
    chains?: { id: number; name: string }[]
    trackedChains?: string[]
    concurrency?: number
    interopEventStore?: InteropEventStore
  } = {},
) {
  return new RelayIndexer(
    options.chains ?? [],
    mockObject<InteropConfigStore>({ get: mockFn().returns(undefined) }),
    options.trackedChains ?? ['ethereum'],
    {
      batchSize: BATCH_SIZE,
      concurrency: options.concurrency ?? 1,
      maxRequestsPerChunk: MAX_REQUESTS_PER_CHUNK,
      safeTimeOffset: SAFE_TIME_OFFSET,
    },
    relayApiClient,
    mockObject<Database>(),
    options.interopEventStore ?? mockObject<InteropEventStore>(),
    new RelayRootIndexer(Logger.SILENT, SAFE_TIME_OFFSET),
    mockObject<IndexerService>(),
    Logger.SILENT,
  )
}

type SaveNewEvents = InteropEventStore['saveNewEvents']

function savedIds(
  saveNewEvents: MockFunction<
    Parameters<SaveNewEvents>,
    ReturnType<SaveNewEvents>
  >,
) {
  return saveNewEvents.calls.map((call) =>
    call.args[0].map((event) => (event.args as { id: string }).id),
  )
}
