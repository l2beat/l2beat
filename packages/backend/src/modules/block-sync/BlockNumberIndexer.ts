import type { Logger } from '@l2beat/backend-tools'
import {
  type BlockHeader,
  type BlockProvider,
  getBlockNumberAtOrBefore,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import { withBlockSyncRpcMetricsContext } from './blockSyncRpcMetrics'

export class BlockNumberIndexer extends RootIndexer {
  blockHeight = -1
  // Each tick fetches only the latest header. Headers seen on earlier ticks
  // are what tells us which block is already old enough, without more calls.
  // A reorg can leave a stale timestamp here, which is harmless: the height is
  // only a lower bound behind a delay of minutes, a replacement block is mined
  // within seconds of the one it replaced, entries are dropped once the height
  // passes them, and BlockIndexer fetches every block fresh by number anyway
  private readonly headers = new Map<number, BlockHeader>()

  constructor(
    private readonly blockProvider: BlockProvider,
    chain: string,
    logger: Logger,
    private delayFromTipInSeconds: number,
    private checkIntervalMs = 10_000,
  ) {
    super(logger.tag({ chain, tag: chain }), {
      tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
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
        const blockNumber = await this.findBlockNumberAtOrBefore(timestamp)
        if (blockNumber > this.blockHeight) {
          this.blockHeight = blockNumber
          this.logger.info('Advanced block number', { blockNumber })
        }
        for (const number of this.headers.keys()) {
          if (number < this.blockHeight) this.headers.delete(number)
        }
        return this.blockHeight
      },
    )
  }

  private async findBlockNumberAtOrBefore(
    timestamp: UnixTime,
  ): Promise<number> {
    const latest = await this.getHeader('latest')
    if (latest.timestamp <= timestamp) return latest.number

    let before: BlockHeader | undefined
    let after = latest
    for (const header of this.headers.values()) {
      if (header.timestamp <= timestamp) {
        if (!before || header.number > before.number) before = header
      } else if (header.number < after.number) {
        after = header
      }
    }

    if (!before) return await this.search(timestamp, 1, after.number)
    // Consecutive polls bracket the timestamp within one interval, so the
    // newest block known to be old enough is close enough. A wider gap means
    // polls were missed and the exact block is worth a few calls
    const maxGap = (2 * this.checkIntervalMs) / 1000
    if (after.timestamp - before.timestamp > maxGap) {
      return await this.search(timestamp, before.number, after.number)
    }
    return before.number
  }

  private search(timestamp: UnixTime, from: number, to: number) {
    return getBlockNumberAtOrBefore(timestamp, from, to, (number) =>
      this.getHeader(number),
    )
  }

  private async getHeader(x: number | 'latest'): Promise<BlockHeader> {
    const known = x !== 'latest' ? this.headers.get(x) : undefined
    if (known) return known
    const header = await this.blockProvider.getBlockHeader(x)
    this.headers.set(header.number, header)
    return header
  }
}
