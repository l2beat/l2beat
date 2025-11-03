import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { ManagedChildIndexer } from '../../../../tools/uif/ManagedChildIndexer'
import type { InteropEventStore } from '../../engine/capture/InteropEventStore'
import {
  Address32,
  createInteropEventType,
  type InteropEvent,
  type InteropEventContext,
} from '../types'
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
  constructor(
    private chains: { id: number; name: string }[],
    private trackedChains: string[],
    private relayApiClient: RelayApiClient,
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
      limit: 50,
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
          blockHash: zeroHash,
          blockNumber: tx?.block ?? -1,
          chain,
          logIndex: -1,
          timestamp: tx?.timestamp ?? timestamp,
          txData: tx?.data?.data ?? '0x',
          txHash: tx?.hash ?? zeroHash,
          txValue: tx?.data?.value ? BigInt(tx.data.value) : 0n,
          txTo: tx?.data?.to ? Address32.from(tx.data.to) : undefined,
        }
      }
      if (srcTx && srcTx.hash && srcTx.hash.length === 66) {
        const srcToken = item.data.metadata?.currencyIn
        const event = TokenSent.create(txToCtx(srcTx, srcChain, createTime), {
          id: item.id,
          amount: srcToken?.amount,
          token: Address32.fromOrUndefined(srcToken?.currency?.address),
          $dstChain: dstChain,
        })
        events.push({ ...event, plugin: 'relay' })
      }
      if (dstTx && dstTx.hash && dstTx.hash.length === 66) {
        const dstToken = item.data.metadata?.currencyIn
        const event = TokenReceived.create(
          txToCtx(dstTx, dstChain, updateTime),
          {
            id: item.id,
            amount: dstToken?.amount,
            token: Address32.fromOrUndefined(dstToken?.currency?.address),
            $srcChain: srcChain,
          },
        )
        events.push({ ...event, plugin: 'relay' })
      }
    }

    const tracked = events.filter((e) =>
      this.trackedChains.includes(e.ctx.chain),
    )

    if (tracked.length > 0) {
      this.logger.info('Saved new events', { events: tracked.length })
      await this.interopEventStore.saveNewEvents(tracked)
    }

    return syncedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
