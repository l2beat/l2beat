import type { Logger } from '@l2beat/backend-tools'
import type { BlockHeader, BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import { withBlockSyncRpcMetricsContext } from './blockSyncRpcMetrics'

export interface BlockNumberIndexerOptions {
  checkIntervalMs?: number
  /** Defaults to twice the number of ticks within the delay from tip. */
  maxHeads?: number
  /** When the unobserved blocks after the answer span longer than this, a
   *  tick reads one of them, so the answer catches up with the delayed
   *  timestamp instead of waiting for the next observed head to get there.
   *  Defaults to three ticks. */
  maxHeadGapSeconds?: number
}

const MAX_HEADS = 500

/**
 * Every tick reads the latest header and answers with the newest observed
 * head that is at least `delayFromTipInSeconds` old. Observed heads are real
 * blocks, so the answer is never newer than the delay allows. The search by
 * timestamp, which reads several full blocks, only runs when no observed head
 * is old enough, such as after a start.
 */
export class BlockNumberIndexer extends RootIndexer {
  blockHeight = -1
  /** Oldest first, block numbers strictly increasing. */
  private readonly heads: BlockHeader[] = []
  private readonly checkIntervalMs: number
  private readonly maxHeads: number
  private readonly maxHeadGapSeconds: number

  constructor(
    private readonly blockProvider: BlockProvider,
    chain: string,
    logger: Logger,
    private readonly delayFromTipInSeconds: number,
    options: BlockNumberIndexerOptions = {},
  ) {
    super(logger.tag({ chain, tag: chain }), {
      tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
    this.checkIntervalMs = options.checkIntervalMs ?? 10_000
    const ticksWithinDelay = Math.ceil(
      (delayFromTipInSeconds * 1000) / this.checkIntervalMs,
    )
    this.maxHeads =
      options.maxHeads ?? Math.min(MAX_HEADS, 2 * ticksWithinDelay + 10)
    this.maxHeadGapSeconds =
      options.maxHeadGapSeconds ?? (3 * this.checkIntervalMs) / 1000
  }

  override initialize() {
    setInterval(() => this.requestTick(), this.checkIntervalMs)
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    return await withBlockSyncRpcMetricsContext(
      'blockSync.tip',
      {
        chain: this.blockProvider.chain,
      },
      async () => {
        const timestamp = UnixTime.now() - this.delayFromTipInSeconds
        this.observe(await this.blockProvider.getBlockHeader('latest'))
        const blockNumber =
          (await this.findObserved(timestamp)) ?? (await this.search(timestamp))

        if (blockNumber > this.blockHeight) {
          this.blockHeight = blockNumber
          this.logger.info('Advanced block number', { blockNumber })
        }
        return this.blockHeight
      },
    )
  }

  private observe(head: BlockHeader) {
    const newest = this.heads.at(-1)
    // Load-balanced RPCs can answer from a node that is behind
    if (newest && head.number <= newest.number) return
    this.insert(head)
  }

  private async findObserved(timestamp: UnixTime) {
    let index = this.heads.length - 1
    while (index >= 0 && this.heads[index].timestamp > timestamp) index--
    if (index === -1) return undefined

    // The timestamp only grows, so older heads cannot answer again
    this.heads.splice(0, index)
    const [answer, next] = this.heads
    if (
      !next ||
      next.number === answer.number + 1 ||
      next.timestamp - answer.timestamp <= this.maxHeadGapSeconds
    ) {
      return answer.number
    }

    const probe = await this.blockProvider.getBlockHeader(
      interpolate(answer, next, timestamp),
    )
    this.insert(probe)
    return probe.timestamp <= timestamp ? probe.number : answer.number
  }

  private async search(timestamp: UnixTime): Promise<number> {
    this.logger.info('Searching tip block by timestamp', {
      reason: this.blockHeight === -1 ? 'start' : 'noObservedHeadOldEnough',
      timestamp,
      observedHeads: this.heads.length,
    })
    const blockNumber = await this.blockProvider.getBlockNumberAtOrBefore(
      timestamp,
      Math.max(this.blockHeight, 1),
    )
    // The found block is at or before the timestamp and every later block is
    // past it, so the timestamp can stand in for the block's own
    this.insert({ number: blockNumber, timestamp })
    return blockNumber
  }

  private insert(head: BlockHeader) {
    const index = this.heads.findIndex((h) => h.number >= head.number)
    if (index === -1) {
      this.heads.push(head)
    } else {
      const replaces = this.heads[index].number === head.number
      this.heads.splice(index, replaces ? 1 : 0, head)
    }
    if (this.heads.length > this.maxHeads) {
      this.heads.splice(0, this.heads.length - this.maxHeads)
    }
  }
}

/** The block between the two at the timestamp, if blocks came evenly. */
function interpolate(
  before: BlockHeader,
  after: BlockHeader,
  timestamp: UnixTime,
): number {
  const blocks = after.number - before.number
  const guess =
    before.number +
    Math.floor(
      ((timestamp - before.timestamp) * blocks) /
        (after.timestamp - before.timestamp),
    )
  return Math.min(Math.max(guess, before.number + 1), after.number - 1)
}
