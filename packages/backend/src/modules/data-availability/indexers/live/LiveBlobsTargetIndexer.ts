import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { EVMBlock, IRpcClient } from '@l2beat/shared'
import { slotAt, slotStart, UnixTime } from '@l2beat/shared-pure'
import { RootIndexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
import {
  getLiveRetryStrategy,
  LIVE_METRICS_CONTEXT,
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
/**
 * Height reported for a fork deeper than `MAX_REORG_DEPTH`: below every stored
 * block, so they all go and the window is fetched again
 */
const REFETCH_WINDOW_HEIGHT = 0

export interface LiveBlobsTargetDependencies {
  rpc: IRpcClient
  db: Database
  /** Unix seconds */
  now?: () => number
  /** Arranges the next tick in `seconds` */
  scheduleTick?: (seconds: number) => void
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
  /** The stored head stands in for the one followed before a restart */
  private headLoaded = false
  /** What the last log said, so that one goes out only when it changes */
  private lastLogged: { head: number; slot: number } | undefined
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly now: () => number
  private readonly scheduleTick: (seconds: number) => void

  constructor(
    private readonly $: LiveBlobsTargetDependencies,
    logger: Logger,
  ) {
    super(logger.tag({ tag: 'ethereum' }), {
      tickRetryStrategy: getLiveRetryStrategy(),
    })
    this.now = $.now ?? UnixTime.now
    this.scheduleTick = $.scheduleTick ?? ((s) => this.setTickTimer(s))
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
        const height = await this.follow(latest)

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

  private async follow(latest: EVMBlock): Promise<number> {
    if (!this.headLoaded) {
      this.head = await this.loadStoredHead()
      this.headLoaded = true
    }
    if (this.head && latest.number < this.head.blockNumber) {
      // A load-balanced RPC can answer from a node a block or two behind
      return this.head.blockNumber
    }

    const forkHeight = await this.findForkHeight(latest)
    if (forkHeight !== undefined) {
      // The chain may now be shorter than the head followed so far
      this.head = undefined
      return forkHeight
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
    const now = this.now()
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

  private async loadStoredHead(): Promise<Head | undefined> {
    const stored = await this.$.db.liveBlock.findHead()
    return stored && { blockNumber: stored.blockNumber, slot: stored.slot }
  }

  /**
   * Compares the newest stored block at or below the head with the chain.
   * The child can lag behind while it backfills, so that is not always the
   * head's parent; and the head itself when a block of the same height
   * replaced it
   */
  private async findForkHeight(latest: EVMBlock): Promise<number | undefined> {
    const newest = await this.$.db.liveBlock.findHead()
    if (!newest) return undefined

    const checked = Math.min(latest.number, newest.blockNumber)
    const stored = await this.$.db.liveBlock.getByBlockNumberRange(
      checked - MAX_REORG_DEPTH,
      checked,
    )
    const storedChecked = stored.at(-1)
    if (storedChecked?.blockNumber !== checked) return undefined

    const onChainHash = await this.hashOnChain(checked, latest)
    if (onChainHash === storedChecked.hash) return undefined

    for (const block of stored.slice(0, -1).reverse()) {
      const onChain = await this.$.rpc.getBlock(block.blockNumber, false)
      if (onChain.hash === block.hash) {
        this.logger.warn('Chain reorganized', {
          forkHeight: block.blockNumber,
          blockNumber: latest.number,
        })
        return block.blockNumber
      }
    }

    this.logger.warn('No recent stored block is on the chain, refetching', {
      checkedFrom: checked,
      maxDepth: MAX_REORG_DEPTH,
      blockNumber: latest.number,
    })
    return REFETCH_WINDOW_HEIGHT
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
    const now = this.now()
    if (answered.slot < slotAt(now)) return RETRY_SECONDS
    return slotStart(answered.slot + 1) + FIRST_TICK_INTO_SLOT - now
  }

  private setTickTimer(seconds: number) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.requestTick(), seconds * 1000)
  }
}

function toHead(block: EVMBlock): Head {
  return { blockNumber: block.number, slot: slotAt(block.timestamp) }
}
