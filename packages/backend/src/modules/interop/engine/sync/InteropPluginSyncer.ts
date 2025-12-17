import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Clients } from '../../../../providers/Clients'
import type { InteropPlugin } from '../../plugins/types'

export class InteropPluginSyncer {
  constructor(
    private chains: { name: string; type: 'evm' }[],
    private clients: Clients,
    private plugins: InteropPlugin[],
    private db: Database,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  start() {
    for (const plugin of this.plugins) {
      if (plugin.capturesEvents) {
        this.syncPlugin(plugin)
      }
    }
  }

  syncPlugin(plugin: InteropPlugin) {
    const pluginConfig = this.db.interopPluginStatus.findByPluginName(plugin.name)
  }
}
