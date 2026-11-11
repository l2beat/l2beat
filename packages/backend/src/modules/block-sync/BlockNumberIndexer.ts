import type { Logger } from '@l2beat/backend-tools'
import type { BlockHeader, BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import { withBlockSyncRpcMetricsContext } from './blockSyncRpcMetrics'

/** Heads stop piling up once they are a delay old, so this limit only matters
 *  when chain timestamps run ahead of the clock. */
const MAX_KEPT_HEADS = 500
/** How many ticks of blocks the gap after the delayed tip may span before a
 *  tick reads a block inside it. */
const MAX_GAP_TICKS = 3

/**
 * Reports the delayed tip: the newest block that is at least
 * `delayFromTipInSeconds` old. Every tick reads the latest header and keeps it
 * until it is old enough to become the delayed tip. Kept heads are real
 * blocks, so the delayed tip is never too new. On a start no kept head is old
 * enough, so the first tick searches by timestamp instead.
 */
export class BlockNumberIndexer extends RootIndexer {
  /** Only moves forward. */
  private delayedTip: BlockHeader | undefined
  /** Heads seen after the delayed tip that are not old enough yet, oldest
   *  first. */
  private readonly keptHeads: BlockHeader[] = []

  constructor(
    private readonly blockProvider: BlockProvider,
    chain: string,
    logger: Logger,
    private readonly delayFromTipInSeconds: number,
    private readonly checkIntervalMs = 10_000,
  ) {
    super(logger.tag({ chain, tag: chain }), {
      tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  get blockHeight() {
    return this.delayedTip?.number ?? -1
  }

  override initialize() {
    setInterval(() => this.requestTick(), this.checkIntervalMs)
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    return await withBlockSyncRpcMetricsContext(
      'blockSync.tip',
      { chain: this.blockProvider.chain },
      () => this.updateDelayedTip(),
    )
  }

  private async updateDelayedTip(): Promise<number> {
    const oldHeight = this.blockHeight
    const cutoff = UnixTime.now() - this.delayFromTipInSeconds

    this.keepHead(await this.blockProvider.getBlockHeader('latest'))
    this.advanceTo(cutoff)
    if (this.delayedTip) {
      await this.readBlockInGap(this.delayedTip, cutoff)
    } else {
      this.delayedTip = await this.searchByTimestamp(cutoff)
    }

    const blockNumber = this.delayedTip.number
    if (blockNumber > oldHeight) {
      this.logger.info('Advanced block number', { blockNumber })
    }
    return blockNumber
  }

  private keepHead(head: BlockHeader) {
    const newest = this.keptHeads.at(-1) ?? this.delayedTip
    // Load-balanced RPCs can answer from a node that is behind
    if (newest && head.number <= newest.number) return
    this.keptHeads.push(head)
    if (this.keptHeads.length > MAX_KEPT_HEADS) this.keptHeads.shift()
  }

  /** Moves the delayed tip to the newest kept head at or before the cutoff. */
  private advanceTo(cutoff: UnixTime) {
    while (this.keptHeads[0] && this.keptHeads[0].timestamp <= cutoff) {
      this.delayedTip = this.keptHeads.shift()
    }
  }

  /**
   * After a start or an RPC outage, the next kept head can be minutes after
   * the delayed tip, and the delayed tip would wait for it to get old enough.
   * Reading one block inside such a gap per tick lets it catch up sooner.
   */
  private async readBlockInGap(delayedTip: BlockHeader, cutoff: UnixTime) {
    const next = this.keptHeads[0]
    if (!next || next.number === delayedTip.number + 1) return
    const maxGapSeconds = (MAX_GAP_TICKS * this.checkIntervalMs) / 1000
    if (next.timestamp - delayedTip.timestamp <= maxGapSeconds) return

    const block = await this.blockProvider.getBlockHeader(
      guessBlockAt(cutoff, delayedTip, next),
    )
    if (block.timestamp <= cutoff) {
      this.delayedTip = block
    } else {
      this.keptHeads.unshift(block)
    }
  }

  private async searchByTimestamp(cutoff: UnixTime): Promise<BlockHeader> {
    this.logger.info('Searching tip block by timestamp', { timestamp: cutoff })
    const number = await this.blockProvider.getBlockNumberAtOrBefore(cutoff)
    // The found block is at or before the cutoff and the next one is past it,
    // so the cutoff can stand in for the block's own timestamp
    return { number, timestamp: cutoff }
  }
}

/** The block made at `timestamp` if blocks between the two came evenly. Never
 *  one of the two, since both are already known. */
function guessBlockAt(
  timestamp: UnixTime,
  before: BlockHeader,
  after: BlockHeader,
): number {
  const blocks = after.number - before.number
  const seconds = after.timestamp - before.timestamp
  const elapsed = timestamp - before.timestamp
  const guess = before.number + Math.floor((elapsed * blocks) / seconds)
  return Math.min(Math.max(guess, before.number + 1), after.number - 1)
}
