import { UpsertMap } from '@l2beat/shared'

export type SyncMode = 'follow' | 'catchUp'
const DEFAULT_MODE: SyncMode = 'follow'

export class InteropSyncModes {
  private perPlugin = new UpsertMap<string, InteropPluginSyncMode>()

  getForPlugin(pluginName: string): InteropPluginSyncMode {
    return this.perPlugin.getOrInsertComputed(
      pluginName,
      () => new InteropPluginSyncMode(pluginName),
    )
  }

  asJson() {
    const result: Record<string, Record<string, SyncMode>> = {}
    for (const [pluginName, mode] of this.perPlugin) {
      result[pluginName] = mode.asJson()
    }
    return result
  }
}

export class InteropPluginSyncMode {
  private perChain = new UpsertMap<string, SyncMode>()

  constructor(private readonly pluginName: string) {}

  getForChain(chain: string): SyncMode {
    return this.perChain.getOrInsert(chain, DEFAULT_MODE)
  }

  setForChain(chain: string, mode: SyncMode) {
    this.perChain.set(chain, mode)
  }

  asJson() {
    return Object.fromEntries(this.perChain)
  }
}
