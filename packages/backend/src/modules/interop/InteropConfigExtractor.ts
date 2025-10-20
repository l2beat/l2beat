import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../tools/TimeLoop'
import type { InteropConfigPlugin } from './config/types'

export class InteropComparator extends TimeLoop {
  constructor(
    private db: Database,
    private plugins: InteropConfigPlugin[],
    protected logger: Logger,
    intervalMs = 20 * 60_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    await Promise.all(this.plugins.map(this.processPlugin))
  }

  async processPlugin(plugin: InteropConfigPlugin) {
    const latest = await plugin.getLatestConfig()
    const previous = await this.db.interopConfig.find(plugin.name)

    const config = plugin.generateNewConfig(previous?.value, latest)

    if (config !== undefined) {
      return
    }

    const now = UnixTime.now()
    if (previous === undefined) {
      await this.db.interopConfig.insert({
        key: plugin.name,
        value: config,
        createdAt: now,
        updatedAt: now,
      })
    } else {
      await this.db.interopConfig.update(plugin.name, {
        value: config,
        updatedAt: now,
      })
    }
  }
}
