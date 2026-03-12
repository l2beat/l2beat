export type PluginStatus = {
  pluginName: string
  chain: string
  syncMode?: string
  toBlock?: string
  toTimestamp?: number
  lastError?: string
  resyncRequestedFrom?: number
}
