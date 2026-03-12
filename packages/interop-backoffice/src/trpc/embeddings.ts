export type PluginStatus = {
  pluginName: string
  chain: string
  syncMode?: string
  toBlock?: string
  toTimestamp?: number
  lastError?: string
  resyncRequestedFrom?: number
}

export type InteropEventStats = {
  type: string
  direction?: string
  count: number
  matched: number
  unmatched: number
  oldUnmatched: number
  unsupported: number
}
