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

export type InteropMessageChainStats = {
  srcChain: string
  dstChain: string
  count: number
  avgDuration: number
}

export type InteropMessageStats = {
  plugin: string
  type: string
  count: number
  avgDuration: number
  knownAppCount: number
  chains: InteropMessageChainStats[]
}

export type InteropTransferChainStats = {
  srcChain: string
  dstChain: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
}

export type InteropTransferStats = {
  plugin: string
  type: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
  chains: InteropTransferChainStats[]
}
