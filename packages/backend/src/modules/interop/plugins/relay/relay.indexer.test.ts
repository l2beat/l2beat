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

    it('throws when the window was not fully fetched', async () => {
      const relayApiClient = clientReturning({
        requests: manyInSameSecond(3, '2026-08-24T14:50:59'),
        continuation: 'cursor-1',
      })
      const indexer = createIndexer(relayApiClient)

      await expect(indexer.update(FROM, FROM + 10_000)).toBeRejectedWith(
        'exceeds INTEROP_RELAY_MAX_REQUESTS_PER_UPDATE=10000',
      )
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
