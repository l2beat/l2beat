export interface PluginStatusRow {
  pluginName: string
  chain: string
  chainStatus: 'active' | 'disabled' | 'stale'
  syncMode?: string
  toBlock?: string
  toTimestamp?: number
  lastError?: string
  resyncRequestedFrom?: number
  blocksAggregation: boolean
}
