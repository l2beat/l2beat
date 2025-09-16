import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { BridgeStore } from './BridgeStore'

export class BridgeCleaner {
  private running = false

  constructor(
    private bridgeStore: BridgeStore,
    private db: Database,
    private logger: Logger,
    private intervalMs = 20 * 60 * 1000,
  ) {}

  start() {
    const run = async () => {
      if (this.running) {
        return
      }
      this.running = true
      try {
        await this.clean()
      } catch (e) {
        this.logger.error(e)
      }
      this.running = false
    }
    setInterval(run, this.intervalMs)
    run()
    this.logger.info('Started')
  }

  async clean() {
    const now = UnixTime.now()
    await this.bridgeStore.deleteExpired(now)
    await this.db.bridgeMessage.deleteBefore(now - 7 * UnixTime.DAY)
    await this.db.bridgeTransfer.deleteBefore(now - 7 * UnixTime.DAY)
  }
}
