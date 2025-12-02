import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropEventContext } from '@l2beat/database'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { ManagedChildIndexer } from '../../../../tools/uif/ManagedChildIndexer'
import type { InteropEventStore } from '../../engine/capture/InteropEventStore'
import { createInteropEventType, type InteropEvent } from '../types'
import type { RelayApiClient } from './RelayApiClient'

export class RelayRootIndexer extends RootIndexer {
  override initialize() {
    setInterval(() => this.requestTick(), 1_000)
    this.requestTick()
    return Promise.resolve(undefined)
  }

  tick(): Promise<number> {
    return Promise.resolve(UnixTime.now())
  }
}

export const TokenSent = createInteropEventType<{
  id: string
  amount?: string
  token?: Address32
  $dstChain: string
}>('relay.TokenSent')

export const TokenReceived = createInteropEventType<{
  id: string
  amount?: string
  token?: Address32
  $srcChain: string
}>('relay.TokenReceived')

export class RelayIndexer extends ManagedChildIndexer {
  private sentIds = new Set<string>()
  private receivedIds = new Set<string>()

  constructor(
    private chains: { id: number; name: string }[],
    private trackedChains: string[],
    private relayApiClient: RelayApiClient,
    private db: Database,
    private interopEventStore: InteropEventStore,
    parent: RelayRootIndexer,
    indexerService: IndexerService,
    logger: Logger,
  ) {
    super({
      parents: [parent],
      indexerService,
      minHeight: 1,
      logger,
      name: 'relay_indexer',
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
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
    return (
      this.chains.find((c) => c.id === chainId)?.name ?? `Unknown_${chainId}`
    )
  }

  async update(from: number, to: number): Promise<number> {
    if (from === 1) {
      return to
    }

    const res = await this.relayApiClient.getAllRequests({
      limit: 500,
      startTimestamp: from,
      sortBy: 'updatedAt',
      sortDirection: 'asc',
    })

    const successes = res.requests.filter((x) => x.status === 'success')
    const last =
      successes.length > 0 ? successes[successes.length - 1] : undefined

    if (!last) {
      // TODO: allow not progressing
      throw new Error('No entries')
    }
    const syncedTo = Math.min(
      to,
      UnixTime.fromDate(new Date(last.updatedAt)) - 1,
    )
    if (syncedTo < from) {
      // TODO: allow not progressing
      throw new Error('No entries')
    }

    const events: InteropEvent[] = []

    for (const item of successes) {
      const updateTime = UnixTime.fromDate(new Date(item.updatedAt))
      if (updateTime > syncedTo) {
        continue
      }
      const createTime = UnixTime.fromDate(new Date(item.createdAt))

      const srcTx = item.data.inTxs?.[0]
      const srcChain = this.getChainName(srcTx?.chainId)

      const dstTx = item.data.outTxs?.[0]
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
        const srcToken = item.data.metadata?.currencyIn
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
        const dstToken = item.data.metadata?.currencyOut
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

    const newTrackedEvents = events.filter((e) => {
      if (!this.trackedChains.includes(e.ctx.chain)) {
        return false
      }

      if (TokenSent.checkType(e)) {
        if (this.sentIds.has(e.args.id)) {
          return false
        }
        this.sentIds.add(e.args.id)
        return true
      }
      if (TokenReceived.checkType(e)) {
        if (this.receivedIds.has(e.args.id)) {
          return false
        }
        this.receivedIds.add(e.args.id)
        return true
      }
      return false
    })

    if (newTrackedEvents.length > 0) {
      this.logger.info('Saved new events', { events: newTrackedEvents.length })
      await this.interopEventStore.saveNewEvents(newTrackedEvents)
    }

    return syncedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
