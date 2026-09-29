import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropEventContext } from '@l2beat/database'
import { Address32, assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import { AsyncMutex } from '../../../../tools/AsyncMutex'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { INDEXER_NAMES } from '../../../../tools/uif/indexerIdentity'
import { ManagedChildIndexer } from '../../../../tools/uif/ManagedChildIndexer'
import type { InteropEventStore } from '../../engine/capture/InteropEventStore'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { createInteropEventType, findChain, type InteropEvent } from '../types'
import type { RelayApiClient, RelayRequest } from './RelayApiClient'
import { buildRelayBootstrapChainNamesById, RelayConfig } from './relay.config'

export interface RelayIndexerConfig {
  batchSize: number
  concurrency: number
  maxRequestsPerChunk: number
  safeTimeOffset: number
}

export class RelayRootIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly safeTimeOffset: number,
  ) {
    super(logger)
  }

  override initialize() {
    setInterval(() => this.requestTick(), 1_000)
    this.requestTick()
    return Promise.resolve(undefined)
  }

  tick(): Promise<number> {
    return Promise.resolve(UnixTime.now() - this.safeTimeOffset)
  }
}

export type TokenSentArgs = {
  id: string
  amount?: string
  token?: Address32
  $dstChain: string
}

export const TokenSent = createInteropEventType<TokenSentArgs>(
  'relay.TokenSent',
  { direction: 'outgoing' },
)

export type TokenReceivedArgs = {
  id: string
  amount?: string
  token?: Address32
  $srcChain: string
}

export const TokenReceived = createInteropEventType<TokenReceivedArgs>(
  'relay.TokenReceived',
  { direction: 'incoming' },
)

export class RelayIndexer extends ManagedChildIndexer {
  private sentIds = new Set<string>()
  private receivedIds = new Set<string>()
  private readonly bootstrapChainNamesById: Map<number, string>
  private readonly relayChainId: number | undefined

  constructor(
    chains: { id: number; name: string }[],
    private configs: InteropConfigStore,
    private trackedChains: string[],
    private readonly relayConfig: RelayIndexerConfig,
    private relayApiClient: RelayApiClient,
    private db: Database,
    private interopEventStore: InteropEventStore,
    parent: RelayRootIndexer,
    indexerService: IndexerService,
    logger: Logger,
  ) {
    super(
      {
        parents: [parent],
        indexerService,
        minHeight: 1,
        name: INDEXER_NAMES.INTEROP_RELAY,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )

    assert(
      Number.isInteger(relayConfig.concurrency) && relayConfig.concurrency > 0,
      'Relay concurrency must be a positive integer',
    )
    this.bootstrapChainNamesById = buildRelayBootstrapChainNamesById(chains)
    this.relayChainId =
      trackedChains.length === 1
        ? chains.find((chain) => chain.name === trackedChains[0])?.id
        : undefined
  }

  override async start(): Promise<void> {
    const sentEvents = await this.db.interopEvent.getByType(TokenSent.type)
    const receivedEvents = await this.db.interopEvent.getByType(
      TokenReceived.type,
    )
    for (const e of sentEvents) {
      this.sentIds.add((e.args as Record<string, unknown>).id as string)
    }
    for (const e of receivedEvents) {
      this.receivedIds.add((e.args as Record<string, unknown>).id as string)
    }
    await super.start()
  }

  private getChainName(chainId: number | undefined) {
    if (chainId === undefined) {
      return 'Unknown'
    }

    const networks = this.configs.get(RelayConfig)
    if (networks) {
      return findChain(networks, (network) => network.chainId, chainId)
    }

    return this.bootstrapChainNamesById.get(chainId) ?? `Unknown_${chainId}`
  }

  async update(from: number, to: number): Promise<number> {
    if (from === 1) {
      return to
    }

    const syncedTo = Math.min(from + this.relayConfig.batchSize, to)
    const windows = splitRange(from, syncedTo, this.relayConfig.concurrency)
    const saveMutex = new AsyncMutex()
    const startedAt = Date.now()
    const results = await Promise.allSettled(
      windows.map((window) =>
        this.syncWindow(window.from, window.to, saveMutex),
      ),
    )

    let chunks = 0
    let requests = 0
    for (const result of results) {
      if (result.status === 'rejected') {
        throw result.reason
      }
      chunks += result.value.chunks
      requests += result.value.requests
    }

    this.logger.info('Processed Relay window', {
      from,
      to: syncedTo,
      partitions: windows.length,
      chunks,
      requests,
      durationMs: Date.now() - startedAt,
    })

    return syncedTo
  }

  private async syncWindow(from: number, to: number, saveMutex: AsyncMutex) {
    let continuation: string | undefined
    const seenCursors = new Set<string>()
    let chunks = 0
    let requests = 0

    do {
      const res = await this.fetchWindow(from, to, continuation)

      // An API that hands back a cursor it already returned, or a cursor with
      // nothing behind it, would otherwise keep this loop running forever.
      if (res.continuation && seenCursors.has(res.continuation)) {
        throw new Error(
          `Relay API returned a repeated continuation cursor for window ${from}-${to}`,
        )
      }
      if (res.requests.length === 0 && res.continuation) {
        throw new Error(
          `Relay API returned a continuation cursor without requests for window ${from}-${to}`,
        )
      }

      await saveMutex.runExclusive(() => this.saveRequests(res.requests))
      chunks++
      requests += res.requests.length

      if (res.continuation) {
        seenCursors.add(res.continuation)
      }
      continuation = res.continuation
    } while (continuation)

    return { chunks, requests }
  }

  private fetchWindow(from: number, to: number, continuation?: string) {
    return this.relayApiClient.getAllRequests({
      startTimestamp: from,
      // Both bounds are inclusive. The extra second covers sub-second updatedAt
      // values right at the boundary; duplicates are dropped by request id.
      endTimestamp: to + 1,
      limit: this.relayConfig.maxRequestsPerChunk,
      status: 'success',
      ...(this.relayChainId !== undefined
        ? { chainId: this.relayChainId }
        : {}),
      ...(continuation !== undefined ? { continuation } : {}),
    })
  }

  private async saveRequests(requests: RelayRequest[]) {
    const successes = requests.filter((x) => x.status === 'success')

    const events: InteropEvent[] = []

    for (const item of successes) {
      const updateTime = UnixTime.fromDate(new Date(item.updatedAt))
      const createTime = UnixTime.fromDate(new Date(item.createdAt))

      const srcTx = item.sourceTx
      const srcChain = this.getChainName(srcTx?.chainId)

      const dstTx = item.destinationTx
      const dstChain = this.getChainName(dstTx?.chainId)

      if (srcChain === dstChain) {
        continue
      }

      function txToCtx(
        tx: typeof srcTx,
        chain: string,
        timestamp: UnixTime,
      ): InteropEventContext {
        const zeroHash =
          '0x0000000000000000000000000000000000000000000000000000000000000000'
        return {
          chain,
          logIndex: -1,
          timestamp: tx?.timestamp ?? timestamp,
          txHash: tx?.hash ?? zeroHash,
        }
      }
      if (srcTx && srcTx.hash && srcTx.hash.length === 66) {
        const srcToken = item.sourceCurrency
        let address = Address32.fromOrUndefined(srcToken?.currency?.address)
        if (address === Address32.ZERO) {
          address = Address32.NATIVE
        }
        const event = TokenSent.createCtx(
          txToCtx(srcTx, srcChain, createTime),
          {
            id: item.id,
            amount: srcToken?.amount,
            token: address,
            $dstChain: dstChain,
          },
        )
        events.push({ ...event, plugin: 'relay' })
      }
      if (dstTx && dstTx.hash && dstTx.hash.length === 66) {
        const dstToken = item.destinationCurrency
        let address = Address32.fromOrUndefined(dstToken?.currency?.address)
        if (address === Address32.ZERO) {
          address = Address32.NATIVE
        }
        const event = TokenReceived.createCtx(
          txToCtx(dstTx, dstChain, updateTime),
          {
            id: item.id,
            amount: dstToken?.amount,
            token: address,
            $srcChain: srcChain,
          },
        )
        events.push({ ...event, plugin: 'relay' })
      }
    }

    // Ids are marked as saved only once persistence succeeded, so a failed
    // save is retried instead of being silently skipped. The chunk-local sets
    // still deduplicate within the chunk itself.
    const chunkSentIds = new Set<string>()
    const chunkReceivedIds = new Set<string>()
    const newTrackedEvents = events.filter((e) => {
      if (!this.trackedChains.includes(e.ctx.chain)) {
        return false
      }

      if (TokenSent.checkType(e)) {
        if (this.sentIds.has(e.args.id) || chunkSentIds.has(e.args.id)) {
          return false
        }
        chunkSentIds.add(e.args.id)
        return true
      }
      if (TokenReceived.checkType(e)) {
        if (
          this.receivedIds.has(e.args.id) ||
          chunkReceivedIds.has(e.args.id)
        ) {
          return false
        }
        chunkReceivedIds.add(e.args.id)
        return true
      }
      return false
    })

    if (newTrackedEvents.length > 0) {
      await this.interopEventStore.saveNewEvents(newTrackedEvents)
      this.logger.info('Saved new events', { events: newTrackedEvents.length })
    }
    for (const id of chunkSentIds) {
      this.sentIds.add(id)
    }
    for (const id of chunkReceivedIds) {
      this.receivedIds.add(id)
    }
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}

function splitRange(from: number, to: number, requestedParts: number) {
  const length = to - from + 1
  const parts = Math.min(requestedParts, length)
  const baseSize = Math.floor(length / parts)
  let remainder = length % parts
  let start = from

  return Array.from({ length: parts }, () => {
    const size = baseSize + (remainder > 0 ? 1 : 0)
    remainder = Math.max(0, remainder - 1)
    const range = {
      from: start,
      to: start + size - 1,
    }
    start = range.to + 1
    return range
  })
}
