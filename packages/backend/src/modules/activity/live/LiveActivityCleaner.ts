import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../tools/TimeLoop'

/**
 * Activity sums an hour an hour after it ends, so it reads blocks up to two
 * hours old. The rest leaves it time to catch up before it fetches them itself
 */
export const LIVE_BLOCKS_KEPT_FOR = 4 * UnixTime.HOUR
const INTERVAL_MS = 10 * UnixTime.MINUTE * 1000

/** Deletes every project's stored blocks once they are too old to be read */
export class LiveActivityCleaner extends TimeLoop {
  constructor(
    private readonly db: Database,
    protected logger: Logger,
  ) {
    super({ intervalMs: INTERVAL_MS })
    this.logger = logger.for(this)
  }

  async run(): Promise<void> {
    const deleted = await this.db.liveActivityBlock.deleteBefore(
      UnixTime.now() - LIVE_BLOCKS_KEPT_FOR,
    )
    this.logger.info('Deleted old blocks', { deleted })
  }
}
