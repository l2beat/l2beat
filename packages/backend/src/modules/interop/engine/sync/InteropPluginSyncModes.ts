import { UpsertMap } from '@l2beat/shared'

export type SyncMode = { current: 'follow' | 'catchUp' }

export class InteropPluginSyncModes {
  private perPlugin = new UpsertMap<string, SyncMode>()

  get(pluginName: string): SyncMode {
    return this.perPlugin.getOrInsertComputed(pluginName, () => ({
      current: 'follow', // TODO: use this as default
      // current: 'catchUp',
    }))
  }
}
