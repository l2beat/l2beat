import type { Logger } from '@l2beat/backend-tools'
import type { BlockHeader, BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import { withBlockSyncRpcMetricsContext } from './blockSyncRpcMetrics'

/** Only reached when chain timestamps run ahead of the clock by the delay. */
const MAX_PENDING_HEADS = 500
/** When the unobserved blocks after the answer span longer than this many
 *  ticks, a tick reads one of them, so the answer catches up with the delayed
 *  timestamp instead of waiting for the next observed head to get there. */
const MAX_GAP_TICKS = 3

/**
 * Every tick reads the latest header and answers with the newest observed
 * head that is at least `delayFromTipInSeconds` old. Observed heads are real
 * blocks, so the answer is never newer than the delay allows. The search by
 * timestamp only runs on a start, before any head is old enough.
 */
export class BlockNumberIndexer extends RootIndexer {
  /** Newest block known to be at or before the delayed timestamp. Only moves
   *  forward. */
  private answer: BlockHeader | undefined
  /** Observed heads after the answer, oldest first, numbers increasing. */
  private readonly pending: BlockHeader[] = []

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
    return this.answer?.number ?? -1
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
        const previous = this.blockHeight
        const timestamp = UnixTime.now() - this.delayFromTipInSeconds
        this.observe(await this.blockProvider.getBlockHeader('latest'))
        while (this.pending[0] && this.pending[0].timestamp <= timestamp) {
          this.answer = this.pending.shift()
        }
        if (this.answer) {
          await this.probeGap(this.answer, timestamp)
        } else {
          this.answer = await this.search(timestamp)
        }

        const blockNumber = this.answer.number
        if (blockNumber > previous) {
          this.logger.info('Advanced block number', { blockNumber })
        }
        return blockNumber
      },
    )
  }

  private observe(head: BlockHeader) {
    const newest = this.pending.at(-1) ?? this.answer
    // Load-balanced RPCs can answer from a node that is behind
    if (newest && head.number <= newest.number) return
    this.pending.push(head)
    if (this.pending.length > MAX_PENDING_HEADS) this.pending.shift()
  }

  private async probeGap(answer: BlockHeader, timestamp: UnixTime) {
    const next = this.pending[0]
    const maxGapSeconds = (MAX_GAP_TICKS * this.checkIntervalMs) / 1000
    if (
      !next ||
      next.number === answer.number + 1 ||
      next.timestamp - answer.timestamp <= maxGapSeconds
    ) {
      return
    }

    const probe = await this.blockProvider.getBlockHeader(
      interpolate(answer, next, timestamp),
    )
    if (probe.timestamp <= timestamp) {
      this.answer = probe
    } else {
      this.pending.unshift(probe)
    }
  }

  private async search(timestamp: UnixTime): Promise<BlockHeader> {
    this.logger.info('Searching tip block by timestamp', { timestamp })
    const number = await this.blockProvider.getBlockNumberAtOrBefore(timestamp)
    // The found block is at or before the timestamp and every later block is
    // past it, so the timestamp can stand in for the block's own
    return { number, timestamp }
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
