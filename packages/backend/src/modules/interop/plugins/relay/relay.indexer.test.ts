import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
const MAX_REQUESTS_PER_UPDATE = 10_000
const SAFE_TIME_OFFSET = 10

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
      })
      expect(syncedTo).toEqual(FROM + 5)
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

    it('halves the window when the fetch hits the request cap', async () => {
      const getAllRequests = mockFn<RelayApiClient['getAllRequests']>()
        .resolvesToOnce({
          requests: manyInSameSecond(3, '2026-08-24T14:50:59'),
          continuation: 'cursor-1',
        })
        .resolvesToOnce({ requests: [] })
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
      )

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(getAllRequests).toHaveBeenCalledTimes(2)
      expect(getAllRequests).toHaveBeenNthCalledWith(1, {
        startTimestamp: FROM,
        endTimestamp: FROM + BATCH_SIZE + 1,
        limit: MAX_REQUESTS_PER_UPDATE,
      })
      expect(getAllRequests).toHaveBeenNthCalledWith(2, {
        startTimestamp: FROM,
        endTimestamp: FROM + BATCH_SIZE / 2 + 1,
        limit: MAX_REQUESTS_PER_UPDATE,
      })
      expect(syncedTo).toEqual(FROM + BATCH_SIZE / 2)
    })

    it('keeps halving down to a single second', async () => {
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().executes(async (options) =>
        options?.endTimestamp === FROM + 1
          ? { requests: [] }
          : { requests: [], continuation: 'cursor-1' },
      )
      const indexer = createIndexer(
        mockObject<RelayApiClient>({ getAllRequests }),
      )

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      const windowLengths = getAllRequests.calls.map(
        (call) => (call.args[0]?.endTimestamp ?? 0) - 1 - FROM,
      )
      expect(windowLengths).toEqual([60, 30, 15, 7, 3, 1, 0])
      expect(syncedTo).toEqual(FROM)
    })

    it('follows the continuation when a single second exceeds the cap', async () => {
      const getAllRequests = mockFn<
        RelayApiClient['getAllRequests']
      >().executes(async (options) => {
        if (options?.endTimestamp !== FROM + 1) {
          return { requests: [], continuation: 'cursor-0' }
        }
        switch (options.continuation) {
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
          chains: [
            { id: 1, name: 'ethereum' },
            { id: 10, name: 'optimism' },
          ],
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      const syncedTo = await indexer.update(FROM, FROM + 10_000)

      expect(syncedTo).toEqual(FROM)
      const continuations = getAllRequests.calls
        .filter((call) => call.args[0]?.endTimestamp === FROM + 1)
        .map((call) => call.args[0]?.continuation)
      expect(continuations).toEqual([undefined, 'cursor-1', 'cursor-2'])
      expect(getAllRequests).toHaveBeenLastCalledWith({
        startTimestamp: FROM,
        endTimestamp: FROM + 1,
        limit: MAX_REQUESTS_PER_UPDATE,
        continuation: 'cursor-2',
      })
      const savedIds = saveNewEvents.calls.map((call) =>
        call.args[0].map((event) => (event.args as { id: string }).id),
      )
      expect(savedIds).toEqual([['a'], ['b'], ['c']])
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
          chains: [
            { id: 1, name: 'ethereum' },
            { id: 10, name: 'optimism' },
          ],
          interopEventStore: mockObject<InteropEventStore>({ saveNewEvents }),
        },
      )

      await indexer.update(FROM, FROM)

      const savedIds = saveNewEvents.calls.map((call) =>
        call.args[0].map((event) => (event.args as { id: string }).id),
      )
      expect(savedIds).toEqual([['a'], ['b']])
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
        chains: [
          { id: 1, name: 'ethereum' },
          { id: 10, name: 'optimism' },
        ],
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
    interopEventStore?: InteropEventStore
  } = {},
) {
  return new RelayIndexer(
    options.chains ?? [],
    mockObject<InteropConfigStore>({ get: mockFn().returns(undefined) }),
    options.trackedChains ?? ['ethereum'],
    {
      batchSize: BATCH_SIZE,
      maxRequestsPerUpdate: MAX_REQUESTS_PER_UPDATE,
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
