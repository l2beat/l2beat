import type { Logger } from '@l2beat/backend-tools'
import { TimeLoop } from '../../tools/TimeLoop'
import type { InteropConfigPlugin } from './config/types'
import type { InteropStore } from './InteropStore'

export class InteropConfigExtractor extends TimeLoop {
  constructor(
    private store: InteropStore,
    private plugins: InteropConfigPlugin[],
    protected logger: Logger,
    intervalMs = 20 * 60_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    await Promise.all(
      this.plugins.map(async (plugin) => {
        try {
          await this.processPlugin(plugin)
          this.logger.info('Config extracted', {
            plugin: plugin.name,
          })
        } catch (error) {
          this.logger.error('Failed to extract config', {
            plugin: plugin.name,
            error,
          })
        }
      }),
    )
  }

  async processPlugin(plugin: InteropConfigPlugin) {
    const latest = await plugin.getLatestConfig()
    const previous = this.store.findConfig(plugin.name)

    const config = plugin.generateNewConfig(previous, latest)

    if (config === 'not-changed') {
      return
    }

    this.logger.info('New config generated', {
      plugin: plugin.name,
    })

    await this.store.saveConfig(plugin.name, config)
  }
}
