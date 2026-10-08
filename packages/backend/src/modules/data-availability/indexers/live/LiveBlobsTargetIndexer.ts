import type { Logger } from '@l2beat/backend-tools'
import type { Database, LiveBlockRecord } from '@l2beat/database'
import type { EVMBlock, IRpcClient } from '@l2beat/shared'
import { slotAt, slotStart } from '@l2beat/shared-pure'
import { RootIndexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
import {
  getLiveRetryStrategy,
  LIVE_METRICS_CONTEXT,
  nowSeconds,
  secondsSince,
} from './liveBlobs'

/** Blocks reach the RPC about a second into their slot */
const FIRST_TICK_INTO_SLOT = 1
/**
 * How soon the head is asked for again while the slot's block has not come.
 * Every quarter second sooner is that much sooner on every screen, and the
 * call costs a few hundred bytes
 */
const RETRY_SECONDS = 0.25
/** Stored blocks compared with the chain, back from the newest, in search of a fork */
const MAX_REORG_DEPTH = 32
/** No recent stored block is on the chain */
const REFETCH_WINDOW = 'refetch-window'
/** Below every stored block, so they all go and the window is fetched again */
const REFETCH_WINDOW_HEIGHT = 0

export interface LiveBlobsTargetIndexerDependencies {
  rpc: IRpcClient
  db: Database
}

interface Head {
  blockNumber: number
  slot: number
}

/**
 * Follows the Ethereum head slot by slot for the live blobs view. Its height
 * is the head's block number, or, when the chain has moved off the stored
 * blocks, the newest stored block still on the chain, so that the child drops
 * the ones above it
 */
export class LiveBlobsTargetIndexer extends RootIndexer {
  private head: Head | undefined
  /** After a restart the stored head stands in for the one followed before */
  private headLoaded = false
  private lastLogged: { head: number; slot: number } | undefined
  private timer: ReturnType<typeof setTimeout> | undefined

  constructor(
    private readonly $: LiveBlobsTargetIndexerDependencies,
    logger: Logger,
  ) {
    super(logger.tag({ tag: 'ethereum', project: 'ethereum' }), {
      tickRetryStrategy: getLiveRetryStrategy(),
    })
  }

  override initialize() {
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    return await withCoreFeatureRpcMetricsContext(
      LIVE_METRICS_CONTEXT,
      { daLayer: 'ethereum' },
      async () => {
        const latest = await this.$.rpc.getBlock('latest', false)
        const newestStored = await this.$.db.liveBlock.findHead()
        const height = await this.follow(latest, newestStored)

        this.logHead(this.head ?? toHead(latest))

        // After a fork the head is followed again once the child has dropped
        // the blocks above it, without waiting for the next slot
        const forkReported = height < latest.number
        this.scheduleTick(
          forkReported
            ? RETRY_SECONDS
            : this.secondsUntilNextBlock(toHead(latest)),
        )
        return height
      },
    )
  }

  private async follow(
    latest: EVMBlock,
    newestStored: LiveBlockRecord | undefined,
  ): Promise<number> {
    if (!this.headLoaded) {
      this.head = newestStored && toStoredHead(newestStored)
      this.headLoaded = true
    }
    if (this.head && latest.number < this.head.blockNumber) {
      // A load-balanced RPC can answer from a node a block or two behind
      return this.head.blockNumber
    }

    const fork = await this.findFork(latest, newestStored)
    if (fork === REFETCH_WINDOW) {
      this.head = undefined
      return REFETCH_WINDOW_HEIGHT
    }
    if (fork !== undefined) {
      // The chain may now be shorter than the head followed so far, but not
      // shorter than the fork block: a node answering from below it next is
      // behind, not on another chain
      this.head = toStoredHead(fork)
      return fork.blockNumber
    }

    this.head = toHead(latest)
    return latest.number
  }

  /**
   * Once per new head or new slot: asked four times a second, the head
   * would otherwise be logged as often. A head that stalls still shows, by
   * its lag growing slot by slot
   */
  private logHead(head: Head) {
    const now = nowSeconds()
    const slot = slotAt(now)
    if (this.lastLogged?.head === head.slot && this.lastLogged.slot === slot) {
      return
    }
    this.lastLogged = { head: head.slot, slot }
    this.logger.info('Live head', {
      head: head.slot,
      blockNumber: head.blockNumber,
      lagSlots: slot - head.slot,
      delaySeconds: secondsSince(slotStart(head.slot), now),
    })
  }

  /**
   * The newest stored block still on the chain, when the chain moved off the
   * stored blocks. Compares the newest stored block at or below the head with
   * the chain. The child can lag behind while it backfills, so that is not
   * always the head's parent; and the head itself when a block of the same
   * height replaced it. The blocks below are read only once that one is off
   * the chain: the check runs up to four times a second
   */
  private async findFork(
    latest: EVMBlock,
    newestStored: LiveBlockRecord | undefined,
  ): Promise<LiveBlockRecord | typeof REFETCH_WINDOW | undefined> {
    if (!newestStored) return undefined

    const checked = Math.min(latest.number, newestStored.blockNumber)
    const storedChecked =
      checked === newestStored.blockNumber
        ? newestStored
        : await this.$.db.liveBlock.findByBlockNumber(checked)
    if (!storedChecked) return undefined

    const onChainHash = await this.hashOnChain(checked, latest)
    if (onChainHash === storedChecked.hash) return undefined

    const below = await this.$.db.liveBlock.getByBlockNumberRange(
      checked - MAX_REORG_DEPTH,
      checked - 1,
    )
    for (const block of below.reverse()) {
      const onChain = await this.$.rpc.getBlock(block.blockNumber, false)
      if (onChain.hash === block.hash) {
        this.logger.warn('Chain reorganized', {
          forkHeight: block.blockNumber,
          blockNumber: latest.number,
        })
        return block
      }
    }

    this.logger.warn('No recent stored block is on the chain, refetching', {
      checkedFrom: checked,
      maxDepth: MAX_REORG_DEPTH,
      blockNumber: latest.number,
    })
    return REFETCH_WINDOW
  }

  /** The head answers for itself and its parent, sparing a call */
  private async hashOnChain(blockNumber: number, latest: EVMBlock) {
    if (blockNumber === latest.number) return latest.hash
    if (blockNumber === latest.number - 1) return latest.parentHash
    return (await this.$.rpc.getBlock(blockNumber, false)).hash
  }

  /**
   * A second into the next slot, when its block should have reached the RPC.
   * While the RPC's head is from an earlier slot than the one under way, its
   * block may still come, or the slot is missed: asked again shortly
   */
  private secondsUntilNextBlock(answered: Head): number {
    const now = nowSeconds()
    if (answered.slot < slotAt(now)) return RETRY_SECONDS
    return slotStart(answered.slot + 1) + FIRST_TICK_INTO_SLOT - now
  }

  private scheduleTick(seconds: number) {
    clearTimeout(this.timer)
    this.timer = setTimeout(
      () => this.requestTick(),
      Math.round(seconds * 1000),
    )
  }
}

function toHead(block: EVMBlock): Head {
  return { blockNumber: block.number, slot: slotAt(block.timestamp) }
}

function toStoredHead(block: LiveBlockRecord): Head {
  return { blockNumber: block.blockNumber, slot: block.slot }
}
