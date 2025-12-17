import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropPluginStatusRecord } from '@l2beat/database'
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

  async start() {
    for (const plugin of this.plugins) {
      if (plugin.capturesEvents) {
        await this.syncPlugin(plugin)
      }
    }
  }

  async syncPlugin(plugin: InteropPlugin) {
    let pluginStatus = await this.db.interopPluginStatus.findByPluginName(
      plugin.name,
    )
    if (!pluginStatus) {
      pluginStatus = await this.initializePluginStatus(plugin.name)
    }
  }

  async initializePluginStatus(pluginName: string) {
    const record: InteropPluginStatusRecord = {
      pluginName,
      syncedBlockRanges: {},
      resyncRequestedFrom: null,
    }
    return await this.db.interopPluginStatus.insert(record)
  }
}
