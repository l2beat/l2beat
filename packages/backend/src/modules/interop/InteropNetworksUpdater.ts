import type { Logger } from '@l2beat/backend-tools'
import { TimeLoop } from '../../tools/TimeLoop'
import type { InteropStore } from './InteropStore'
import type { InteropNetworks, InteropNetworksPlugin } from './networks/types'

export class InteropNetworksUpdater extends TimeLoop {
  constructor(
    private store: InteropStore,
    private plugins: InteropNetworksPlugin[],
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
          this.logger.info('Networks updated', {
            plugin: plugin.name,
          })
        } catch (error) {
          this.logger.error('Failed to update networks', {
            plugin: plugin.name,
            error,
          })
        }
      }),
    )
  }

  async processPlugin(plugin: InteropNetworksPlugin) {
    const latest = await plugin.getLatestNetworks()
    const previous = this.store.findNetworks<InteropNetworks>(plugin.name)

    const networks = plugin.reconcileNetworks(previous, latest)

    if (networks === 'not-changed') {
      return
    }

    this.logger.info('New networks generated', {
      plugin: plugin.name,
    })

    await this.store.saveNetworks(plugin.name, networks)
  }
}
