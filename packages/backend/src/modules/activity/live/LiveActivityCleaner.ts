import type { Logger } from '@l2beat/backend-tools'
import { type Database, LIVE_BUFFER_SECONDS } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../tools/TimeLoop'

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
      UnixTime.now() - LIVE_BUFFER_SECONDS,
    )
    this.logger.info('Deleted old blocks', { deleted })
  }
}
